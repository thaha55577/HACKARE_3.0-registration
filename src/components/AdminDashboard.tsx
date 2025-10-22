import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

interface Member {
  name: string;
  regNo: string;
  year: string;
  dept: string;
}

interface Team {
  teamName: string;
  members: Member[];
}

interface AttendanceRow {
  teamNumber: number;
  teamName: string;
  regNo: string;
  name: string;
  isFirstMember: boolean;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const teamsRef = ref(db, 'teams');

    const handleData = (snapshot: any) => {
      const data = snapshot.val();

      if (!data) {
        setTeams([]);
        setLoading(false);
        return;
      }

      const processedTeams = Object.entries(data).map(([teamName, teamData]: [string, any]) => ({
        teamName,
        members: teamData.members || [],
      }));

      setTeams(processedTeams);
      setLoading(false);
    };

    onValue(teamsRef, handleData);

    return () => {
      off(teamsRef);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const flattenTeamsToRows = (teams: Team[]): AttendanceRow[] => {
    const rows: AttendanceRow[] = [];
    teams.forEach((team, teamIndex) => {
      team.members.forEach((member, memberIndex) => {
        rows.push({
          teamNumber: teamIndex + 1,
          teamName: team.teamName,
          regNo: member.regNo,
          name: member.name,
          isFirstMember: memberIndex === 0,
        });
      });
    });
    return rows;
  };

  const attendanceRows = flattenTeamsToRows(filteredTeams);

  const handleExportCSV = () => {
    if (filteredTeams.length === 0) {
      toast.error('No teams to export');
      return;
    }

    let csvContent = 'Team Number,Team Name,Reg Number,Name\n';

    attendanceRows.forEach((row) => {
      csvContent += `${row.teamNumber},"${row.teamName}","${row.regNo}","${row.name}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'HackARE-3.0-Team-Details.csv');
    toast.success('CSV exported successfully');
  };

  const handleExportPDF = async () => {
    if (filteredTeams.length === 0) {
      toast.error('No teams to export');
      return;
    }

    const doc = new jsPDF();

    try {
      const img = new Image();
      img.src = '/ACM_LOGO.png';
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
      doc.addImage(img, 'PNG', 14, 10, 25, 25);
    } catch (error) {
      console.log('Logo not loaded');
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('KALASALINGAM ACADEMY OF RESEARCH AND EDUCATION', 105, 15, { align: 'center' });

    doc.setFontSize(11);
    doc.text('KARE ACM STUDENT CHAPTER – HACKARE 3.0', 105, 22, { align: 'center' });

    doc.setFontSize(10);
    doc.text('TEAM REGISTRATION SHEET', 105, 29, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 35, { align: 'center' });

    const tableData = attendanceRows.map((row) => [
      row.teamNumber.toString(),
      row.teamName,
      row.regNo,
      row.name,
    ]);

    autoTable(doc, {
      head: [['Team Number', 'Team Name', 'Reg Number', 'Name']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 9,
        lineWidth: 0.1,
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 25 },
        1: { halign: 'left', cellWidth: 55 },
        2: { halign: 'center', cellWidth: 45 },
        3: { halign: 'left', cellWidth: 65 },
      },
    });

    doc.save('HackARE-3.0-Team-Details.pdf');
    toast.success('PDF exported successfully');
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="title-glow text-4xl">Admin Portal</h1>
            <button onClick={handleLogout} className="glow-btn">
              Logout
            </button>
          </div>

          <div className="glass-card mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <input
                type="text"
                placeholder="Search by team name..."
                className="glow-input flex-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex gap-3">
                <button onClick={handleExportCSV} className="glow-btn">
                  Download CSV
                </button>
                <button onClick={handleExportPDF} className="glow-btn">
                  Download PDF
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="loader"></div>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="glass-card text-center py-12">
              <p className="text-xl text-cyan-300">
                {searchTerm
                  ? 'No teams found matching your search.'
                  : 'No teams registered yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '120px', textAlign: 'center' }}>Team Number</th>
                    <th style={{ width: '200px' }}>Team Name</th>
                    <th style={{ width: '150px', textAlign: 'center' }}>Reg Number</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRows.map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                      style={{
                        borderTop: row.isFirstMember && index !== 0 ? '2px solid rgba(0, 212, 255, 0.6)' : undefined,
                      }}
                    >
                      <td style={{ textAlign: 'center', fontWeight: row.isFirstMember ? '700' : 'normal' }}>
                        {row.teamNumber}
                      </td>
                      <td style={{ fontWeight: row.isFirstMember ? '700' : 'normal' }}>
                        {row.teamName}
                      </td>
                      <td style={{ textAlign: 'center' }}>{row.regNo}</td>
                      <td>{row.name}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 text-center text-cyan-300">
            <p>Total Teams: {filteredTeams.length} | Total Members: {attendanceRows.length}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
