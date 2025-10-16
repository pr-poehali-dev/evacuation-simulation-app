import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface PeopleConfigProps {
  onAddPerson: (type: 'adult' | 'child' | 'elderly' | 'disabled') => void;
  peopleCount: number;
  placementMode: 'person' | 'emergency' | null;
  onSetPlacementMode: (type: 'adult' | 'child' | 'elderly' | 'disabled') => void;
  onCancelPlacement: () => void;
}

const PeopleConfig = ({ onAddPerson, peopleCount, placementMode, onSetPlacementMode, onCancelPlacement }: PeopleConfigProps) => {
  const peopleTypes = [
    { type: 'adult' as const, label: 'Взрослый', icon: 'User', color: 'bg-blue-500', speed: '1.5 м/с' },
    { type: 'child' as const, label: 'Ребенок', icon: 'Baby', color: 'bg-amber-500', speed: '1.2 м/с' },
    { type: 'elderly' as const, label: 'Пожилой', icon: 'UserCheck', color: 'bg-purple-500', speed: '0.8 м/с' },
    { type: 'disabled' as const, label: 'Маломобильный', icon: 'Wheelchair', color: 'bg-pink-500', speed: '0.5 м/с' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Добавить людей</h3>
        <span className="text-sm text-gray-500">Всего: {peopleCount}</span>
      </div>

      <div className="space-y-3">
        {placementMode === 'person' && (
          <div className="p-3 bg-green-50 border border-green-300 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700">Режим размещения</span>
              </div>
              <Button size="sm" variant="ghost" onClick={onCancelPlacement}>
                <Icon name="X" size={16} />
              </Button>
            </div>
            <p className="text-xs text-green-600 mt-1">Кликните на план для размещения</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {peopleTypes.map(({ type, label, icon, color, speed }) => (
            <Button
              key={type}
              onClick={() => onSetPlacementMode(type)}
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3 hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              <div className={`${color} w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md`}>
                <Icon name={icon} size={20} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">{label}</div>
                <div className="text-xs text-gray-500">{speed}</div>
              </div>
              <Icon name="MousePointerClick" size={18} className="text-gray-400" />
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
          <p className="text-xs text-blue-700">
            Нажмите на тип человека, затем кликните на план здания для размещения. Кликните на человека для редактирования.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PeopleConfig;
