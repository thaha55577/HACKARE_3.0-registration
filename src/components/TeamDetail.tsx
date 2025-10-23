import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../firebase.ts';
import { motion } from 'framer-motion';

const TeamDetail = () => {
  const { teamName } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamName) return;
    const teamRef = ref(db, `teams/${teamName}`);
    function handle(snap: any) {
      setTeam(snap.val());
      setLoading(false);
    }
    onValue(teamRef, handle);
    return () => off(teamRef, handle as any);
  }, [teamName]);

  return (
    <div className="min-h-screen px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="glow-btn mb-4">Back</button>
        {loading ? (
          <div className="glass-card p-6">Loading...</div>
        ) : !team ? (
          <div className="glass-card p-6">Team not found</div>
        ) : (
          <div className="glass-card p-6">
            <h2 className="title-glow text-2xl mb-4">{teamName}</h2>
            <div className="grid gap-4">
              {(team.members || []).map((m: any, idx: number) => (
                <div key={idx} className="p-4 border border-cyan-500/30 rounded-md">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-sm text-cyan-200">{m.regNo} • {m.year} • {m.dept}</div>
                  <div className="mt-2">
                    <div className="text-sm text-cyan-300">Residence: {m.residenceType || 'Day Scholar'}</div>
                    {m.residenceType === 'Hosteller' && (
                      <div className="mt-2 p-2 border border-cyan-500/20 rounded-md text-sm text-cyan-300">
                        <div>Hostel: {m.hostelName}</div>
                        <div>Room: {m.roomNumber}</div>
                        <div>Warden: {m.wardenName}</div>
                        <div>Phone: {m.wardenPhone}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TeamDetail;
