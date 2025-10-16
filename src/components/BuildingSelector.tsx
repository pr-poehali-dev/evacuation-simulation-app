import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { buildingTemplates } from '@/types/buildings';

interface BuildingSelectorProps {
  onSelectBuilding: (buildingId: string) => void;
}

const BuildingSelector = ({ onSelectBuilding }: BuildingSelectorProps) => {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');

  const handleSelect = (value: string) => {
    setSelectedBuilding(value);
    onSelectBuilding(value);
  };

  return (
    <Card className="p-4 shadow-xl bg-white/80 backdrop-blur border-gray-200">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon name="Building2" size={20} className="text-gray-700" />
          <h3 className="text-sm font-semibold text-gray-700">Выбор плана здания</h3>
        </div>

        <Select value={selectedBuilding} onValueChange={handleSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите готовый план..." />
          </SelectTrigger>
          <SelectContent>
            {buildingTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{template.name}</span>
                  {template.floors > 1 && (
                    <span className="text-xs text-gray-500">
                      ({template.floors} этажа)
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedBuilding && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600">
              {buildingTemplates.find(b => b.id === selectedBuilding)?.description}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BuildingSelector;
