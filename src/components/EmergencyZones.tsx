import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { Emergency } from '@/pages/Index';

interface EmergencyZonesProps {
  onAddEmergency: (type: 'fire' | 'smoke' | 'collapse') => void;
  emergencies: Emergency[];
  onRemoveEmergency: (id: string) => void;
  placementMode: 'person' | 'emergency' | null;
  onSetPlacementMode: (type: 'fire' | 'smoke' | 'collapse') => void;
  onCancelPlacement: () => void;
}

const EmergencyZones = ({ 
  onAddEmergency, 
  emergencies, 
  onRemoveEmergency,
  placementMode,
  onSetPlacementMode,
  onCancelPlacement
}: EmergencyZonesProps) => {
  const emergencyTypes = [
    { type: 'fire' as const, label: 'Пожар', icon: 'Flame', color: 'bg-red-500', emoji: '🔥' },
    { type: 'smoke' as const, label: 'Задымление', icon: 'Cloud', color: 'bg-gray-500', emoji: '💨' },
    { type: 'collapse' as const, label: 'Обрушение', icon: 'Construction', color: 'bg-orange-500', emoji: '⚠️' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Создать зону ЧС</h3>
        <span className="text-sm text-gray-500">Зон: {emergencies.length}</span>
      </div>

      <div className="space-y-3">
        {placementMode === 'emergency' && (
          <div className="p-3 bg-orange-50 border border-orange-300 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-orange-700">Режим размещения ЧС</span>
              </div>
              <Button size="sm" variant="ghost" onClick={onCancelPlacement}>
                <Icon name="X" size={16} />
              </Button>
            </div>
            <p className="text-xs text-orange-600 mt-1">Кликните на план для размещения</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {emergencyTypes.map(({ type, label, icon, color, emoji }) => (
            <Button
              key={type}
              onClick={() => onSetPlacementMode(type)}
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3 hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              <div className={`${color} w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md text-xl`}>
                {emoji}
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">{label}</div>
                <div className="text-xs text-gray-500">Добавить опасную зону</div>
              </div>
              <Icon name="MousePointerClick" size={18} className="text-gray-400" />
            </Button>
          ))}
        </div>
      </div>

      {emergencies.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Активные зоны ЧС</h4>
          <div className="space-y-2">
            {emergencies.map((emergency) => {
              const typeData = emergencyTypes.find(t => t.type === emergency.type);
              return (
                <div
                  key={emergency.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{typeData?.emoji}</span>
                    <span className="text-sm font-medium text-gray-700">{typeData?.label}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveEmergency(emergency.id)}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-start gap-2">
          <Icon name="AlertTriangle" size={16} className="text-red-600 mt-0.5" />
          <p className="text-xs text-red-700">
            Нажмите на тип ЧС, затем кликните на план для размещения зоны. Люди будут обходить опасные зоны.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyZones;
