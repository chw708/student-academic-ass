import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { FloppyDisk, Trash, Calendar } from '@phosphor-icons/react'; // Save → FloppyDisk
import { Subject, SUBJECTS } from '@/lib/types';

export function SettingsPage() {
  const [settings, setSettings] = useState<{ subject: Subject; target: string }[]>([]);
  const [targetValue, setTargetValue] = useState('');

  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('settings', JSON.stringify(settings));
    alert('설정이 저장되었습니다.'); // toast → alert
  };

  const deleteSettings = () => {
    localStorage.removeItem('settings');
    setSettings([]);
    alert('설정이 삭제되었습니다.');
  };

  return (
    <div className="space-y-4 text-white">
      <Input
        type="text"
        placeholder="목표값 입력"
        value={targetValue}
        onChange={(e) => setTargetValue(e.target.value)}
      />
      <button
        onClick={saveSettings}
        className="w-full bg-blue-600 py-2 rounded-lg flex items-center justify-center hover:bg-blue-700 transition"
      >
        <FloppyDisk size={16} className="mr-2" /> 저장하기
      </button>
      <button
        onClick={deleteSettings}
        className="w-full bg-red-600 py-2 rounded-lg flex items-center justify-center hover:bg-red-700 transition"
      >
        <Trash size={16} className="mr-2" /> 삭제하기
      </button>
    </div>
  );
}
