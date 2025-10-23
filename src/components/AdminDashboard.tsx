import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db, auth } from '../firebase.ts';
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
  residenceType?: 'Day Scholar' | 'Hosteller';
  hostelName?: string;
  roomNumber?: string;
  wardenName?: string;
  wardenPhone?: string;
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
  residenceType?: string;
  hostelName?: string;
  roomNumber?: string;
  wardenName?: string;
  wardenPhone?: string;
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
          residenceType: member.residenceType || 'Day Scholar',
          hostelName: member.hostelName || '',
          roomNumber: member.roomNumber || '',
          wardenName: member.wardenName || '',
          wardenPhone: member.wardenPhone || '',
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

    // CSV header with new residence/hostel columns
    let csvContent = 'Team Number,Team Name,Reg Number,Name,Residence Type,Hostel Name,Room Number,Warden Name,Warden Phone\n';

    attendanceRows.forEach((row) => {
      const escape = (s?: string) => `"${(s || '').replace(/"/g, '""')}"`;
      csvContent += `${row.teamNumber},${escape(row.teamName)},${escape(row.regNo)},${escape(row.name)},${escape(row.residenceType)},${escape(row.hostelName)},${escape(row.roomNumber)},${escape(row.wardenName)},${escape(row.wardenPhone)}\n`;
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
      row.residenceType || 'Day Scholar',
      row.hostelName || '',
      row.roomNumber || '',
      row.wardenName || '',
      row.wardenPhone || '',
    ]);

    autoTable(doc, {
      head: [[
        'Team Number',
        'Team Name',
        'Reg Number',
        'Name',
        'Residence Type',
        'Hostel Name',
        'Room Number',
        'Warden Name',
        'Warden Phone'
      ]],
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
      // rely on autoTable default column sizing for PDF
    });

    doc.save('HackARE-3.0-Team-Details.pdf');
    toast.success('PDF exported successfully');
  };

  const handleExportFilteredPDF = async (filterType: 'Hosteller' | 'Day Scholar') => {
    const filteredRows = attendanceRows.filter((r) => (r.residenceType || 'Day Scholar') === filterType);
    if (filteredRows.length === 0) {
      toast.error(`No ${filterType === 'Hosteller' ? 'hostellers' : 'day scholars'} to export`);
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
    doc.text(`${filterType.toUpperCase()} - TEAM REGISTRATION SHEET`, 105, 29, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 35, { align: 'center' });

    const tableData = filteredRows.map((row) => [
      row.teamNumber.toString(),
      row.teamName,
      row.regNo,
      row.name,
      row.residenceType || 'Day Scholar',
      row.hostelName || '',
      row.roomNumber || '',
      row.wardenName || '',
      row.wardenPhone || '',
    ]);

    autoTable(doc, {
      head: [[
        'Team Number',
        'Team Name',
        'Reg Number',
        'Name',
        'Residence Type',
        'Hostel Name',
        'Room Number',
        'Warden Name',
        'Warden Phone'
      ]],
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
      // rely on defaults
    });

    const fileName = filterType === 'Hosteller' ? 'HackARE-3.0-Hostellers.pdf' : 'HackARE-3.0-DayScholars.pdf';
    doc.save(fileName);
    toast.success(`${fileName} exported successfully`);
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
              <div className="flex flex-col gap-2 ml-2 mt-2">
                <button onClick={() => handleExportFilteredPDF('Hosteller')} className="glow-btn">
                  Download Hostellers PDF
                </button>
                <button onClick={() => handleExportFilteredPDF('Day Scholar')} className="glow-btn">
                  Download Day Scholars PDF
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
            <div className="space-y-3">
              {filteredTeams.map((team, idx) => (
                <motion.div
                  key={team.teamName}
                  className="glass-card p-4 cursor-pointer flex items-center justify-between"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.02 }}
                  onClick={() => navigate(`/admin/team/${encodeURIComponent(team.teamName)}`)}
                  role="button"
                  tabIndex={0}
                >
                  <div>
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'Orbitron' }}>{team.teamName}</h3>
                    <div className="text-sm text-cyan-300">Members: {team.members.length}</div>
                  </div>
                  <div className="text-cyan-200 text-sm">View details →</div>
                </motion.div>
              ))}
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
