import { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

interface Member {
  name: string;
  regNo: string;
  year: string;
  dept: string;
}

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);

  const [leader, setLeader] = useState<Member>({
    name: '',
    regNo: '',
    year: '',
    dept: '',
  });

  const [member1, setMember1] = useState<Member>({
    name: '',
    regNo: '',
    year: '',
    dept: '',
  });

  const [member2, setMember2] = useState<Member>({
    name: '',
    regNo: '',
    year: '',
    dept: '',
  });

  const [member3, setMember3] = useState<Member>({
    name: '',
    regNo: '',
    year: '',
    dept: '',
  });

  const [member4, setMember4] = useState<Member>({
    name: '',
    regNo: '',
    year: '',
    dept: '',
  });

  const handleMemberChange = (
    memberSetter: React.Dispatch<React.SetStateAction<Member>>,
    field: keyof Member,
    value: string
  ) => {
    memberSetter((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    const members = [leader, member1, member2, member3, member4];

    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      if (!member.name || !member.regNo || !member.year || !member.dept) {
        toast.error(`Please fill all fields for ${i === 0 ? 'Team Leader' : `Member ${i}`}`);
        return;
      }
    }

    setLoading(true);

    try {
      await set(ref(db, 'teams/' + teamName), {
        members: members,
      });

      toast.success('Team Registered Successfully!');

      setTeamName('');
      setLeader({ name: '', regNo: '', year: '', dept: '' });
      setMember1({ name: '', regNo: '', year: '', dept: '' });
      setMember2({ name: '', regNo: '', year: '', dept: '' });
      setMember3({ name: '', regNo: '', year: '', dept: '' });
      setMember4({ name: '', regNo: '', year: '', dept: '' });
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderMemberFields = (
    member: Member,
    setter: React.Dispatch<React.SetStateAction<Member>>,
    label: string
  ) => (
    <div className="mb-6 p-4 border border-cyan-500/30 rounded-lg">
      <h3 className="text-cyan-300 font-semibold mb-3" style={{ fontFamily: 'Orbitron' }}>
        {label}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Name"
          className="glow-input"
          value={member.name}
          onChange={(e) => handleMemberChange(setter, 'name', e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Register Number"
          className="glow-input"
          value={member.regNo}
          onChange={(e) => handleMemberChange(setter, 'regNo', e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Year"
          className="glow-input"
          value={member.year}
          onChange={(e) => handleMemberChange(setter, 'year', e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Department"
          className="glow-input"
          value={member.dept}
          onChange={(e) => handleMemberChange(setter, 'dept', e.target.value)}
          required
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-4xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="title-glow text-3xl">Team Registration</h2>
          <button onClick={handleLogout} className="glow-btn text-sm px-4 py-2">
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="scrollable-form">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Team Name"
                className="glow-input"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>

            {renderMemberFields(leader, setLeader, 'Team Leader')}
            {renderMemberFields(member1, setMember1, 'Member 1')}
            {renderMemberFields(member2, setMember2, 'Member 2')}
            {renderMemberFields(member3, setMember3, 'Member 3')}
            {renderMemberFields(member4, setMember4, 'Member 4')}
          </div>

          <button type="submit" className="glow-btn w-full mt-4" disabled={loading}>
            {loading ? 'Registering...' : 'Register Team'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default RegistrationForm;
