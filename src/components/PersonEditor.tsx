import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import type { Person } from '@/pages/Index';

interface PersonEditorProps {
  person: Person;
  onUpdate: (person: Person) => void;
  onDelete: (personId: string) => void;
  onClose: () => void;
}

const PersonEditor = ({ person, onUpdate, onDelete, onClose }: PersonEditorProps) => {
  const [editedPerson, setEditedPerson] = useState<Person>(person);

  const personTypeOptions = [
    { value: 'adult', label: 'Взрослый', color: 'text-blue-600', icon: 'User' },
    { value: 'child', label: 'Ребенок', color: 'text-amber-600', icon: 'Baby' },
    { value: 'elderly', label: 'Пожилой', color: 'text-purple-600', icon: 'UserCheck' },
    { value: 'disabled', label: 'Маломобильный', color: 'text-pink-600', icon: 'Wheelchair' },
  ];

  const handleTypeChange = (type: Person['type']) => {
    const speedMap = {
      adult: 1.5,
      child: 1.2,
      elderly: 0.8,
      disabled: 0.5,
    };
    const sizeMap = {
      adult: 10,
      child: 8,
      elderly: 10,
      disabled: 12,
    };
    
    setEditedPerson({
      ...editedPerson,
      type,
      speed: speedMap[type],
      size: sizeMap[type],
    });
  };

  const handleSpeedChange = (value: number[]) => {
    setEditedPerson({ ...editedPerson, speed: value[0] });
  };

  const handleSizeChange = (value: number[]) => {
    setEditedPerson({ ...editedPerson, size: value[0] });
  };

  const handleSave = () => {
    onUpdate(editedPerson);
  };

  const handleDelete = () => {
    onDelete(person.id);
  };

  const currentType = personTypeOptions.find(opt => opt.value === editedPerson.type);

  return (
    <Card className="p-6 shadow-xl bg-white/80 backdrop-blur border-gray-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
              <Icon name="UserCog" className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Редактор человека</h3>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <Icon name="X" size={18} />
          </Button>
        </div>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Тип человека</Label>
            <Select 
              value={editedPerson.type} 
              onValueChange={(value) => handleTypeChange(value as Person['type'])}
            >
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <Icon name={currentType?.icon || 'User'} size={16} className={currentType?.color} />
                    <span>{currentType?.label}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {personTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon name={option.icon} size={16} className={option.color} />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-gray-700">Скорость движения</Label>
              <span className="text-sm font-semibold text-gray-900">{editedPerson.speed.toFixed(1)} м/с</span>
            </div>
            <Slider
              value={[editedPerson.speed]}
              onValueChange={handleSpeedChange}
              min={0.3}
              max={2.5}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Влияет на время эвакуации</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-gray-700">Размер</Label>
              <span className="text-sm font-semibold text-gray-900">{editedPerson.size} px</span>
            </div>
            <Slider
              value={[editedPerson.size]}
              onValueChange={handleSizeChange}
              min={6}
              max={16}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Визуальный размер на плане</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-lg">
            <div>
              <span className="text-gray-500">Позиция X:</span>
              <span className="ml-2 font-mono font-semibold text-gray-700">{editedPerson.x.toFixed(0)}</span>
            </div>
            <div>
              <span className="text-gray-500">Позиция Y:</span>
              <span className="ml-2 font-mono font-semibold text-gray-700">{editedPerson.y.toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          >
            <Icon name="Check" size={18} className="mr-2" />
            Сохранить
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="flex-1"
          >
            <Icon name="Trash2" size={18} className="mr-2" />
            Удалить
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PersonEditor;
