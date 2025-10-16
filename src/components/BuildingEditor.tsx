import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface BuildingEditorProps {
  placementMode: 'person' | 'emergency' | 'room' | 'exit' | 'safezone' | null;
  onSetPlacementMode: (mode: 'room' | 'exit' | 'safezone') => void;
  onCancelPlacement: () => void;
  roomsCount: number;
  exitsCount: number;
  safeZonesCount: number;
}

const BuildingEditor = ({
  placementMode,
  onSetPlacementMode,
  onCancelPlacement,
  roomsCount,
  exitsCount,
  safeZonesCount,
}: BuildingEditorProps) => {
  const tools = [
    { mode: 'room' as const, label: 'Нарисовать комнату', icon: 'Square', color: 'bg-blue-500', count: roomsCount },
    { mode: 'exit' as const, label: 'Добавить выход', icon: 'DoorOpen', color: 'bg-green-500', count: exitsCount },
    { mode: 'safezone' as const, label: 'Зона сбора', icon: 'MapPin', color: 'bg-emerald-500', count: safeZonesCount },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Редактор здания</h3>
      </div>

      <div className="space-y-3">
        {(placementMode === 'room' || placementMode === 'exit' || placementMode === 'safezone') && (
          <div className="p-3 bg-purple-50 border border-purple-300 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-purple-700">Режим редактирования</span>
              </div>
              <Button size="sm" variant="ghost" onClick={onCancelPlacement}>
                <Icon name="X" size={16} />
              </Button>
            </div>
            <p className="text-xs text-purple-600 mt-1">
              {placementMode === 'room' && 'Кликните дважды для обозначения углов комнаты'}
              {placementMode === 'exit' && 'Кликните для размещения выхода'}
              {placementMode === 'safezone' && 'Кликните дважды для обозначения зоны сбора'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {tools.map(({ mode, label, icon, color, count }) => (
            <Button
              key={mode}
              onClick={() => onSetPlacementMode(mode)}
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3 hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              <div className={`${color} w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md`}>
                <Icon name={icon} size={20} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">{label}</div>
                <div className="text-xs text-gray-500">Создано: {count}</div>
              </div>
              <Icon name="Plus" size={18} className="text-gray-400" />
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} className="text-purple-600 mt-0.5" />
          <p className="text-xs text-purple-700">
            Создавайте собственные планы зданий. Комнаты и зоны сбора рисуются двумя кликами, выходы — одним.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuildingEditor;
