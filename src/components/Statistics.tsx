import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import type { Person } from '@/pages/Index';

interface StatisticsProps {
  people: Person[];
  evacuationTime: number;
  isSimulating: boolean;
}

const Statistics = ({ people, evacuationTime, isSimulating }: StatisticsProps) => {
  const evacuatedCount = people.filter(p => p.evacuated).length;
  const totalCount = people.length;

  const typeStats = {
    adult: people.filter(p => p.type === 'adult').length,
    child: people.filter(p => p.type === 'child').length,
    elderly: people.filter(p => p.type === 'elderly').length,
    disabled: people.filter(p => p.type === 'disabled').length,
  };

  const evacuatedByType = {
    adult: people.filter(p => p.type === 'adult' && p.evacuated).length,
    child: people.filter(p => p.type === 'child' && p.evacuated).length,
    elderly: people.filter(p => p.type === 'elderly' && p.evacuated).length,
    disabled: people.filter(p => p.type === 'disabled' && p.evacuated).length,
  };

  const stats = [
    {
      label: 'Взрослые',
      icon: 'User',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      total: typeStats.adult,
      evacuated: evacuatedByType.adult,
    },
    {
      label: 'Дети',
      icon: 'Baby',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      total: typeStats.child,
      evacuated: evacuatedByType.child,
    },
    {
      label: 'Пожилые',
      icon: 'UserCheck',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      total: typeStats.elderly,
      evacuated: evacuatedByType.elderly,
    },
    {
      label: 'Маломобильные',
      icon: 'Wheelchair',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      total: typeStats.disabled,
      evacuated: evacuatedByType.disabled,
    },
  ];

  return (
    <Card className="p-6 shadow-xl bg-white/80 backdrop-blur border-gray-200">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Icon name="BarChart3" size={20} />
        Статистика эвакуации
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-2">
            <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl flex items-center justify-center`}>
              <Icon name={stat.icon} size={24} />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {stat.evacuated}/{stat.total}
              </div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Icon name="CheckCircle" size={20} className="text-green-600" />
            <span className="text-sm font-medium text-green-700">Эвакуированы</span>
          </div>
          <div className="text-3xl font-bold text-green-900">{evacuatedCount}</div>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Icon name="Users" size={20} className="text-orange-600" />
            <span className="text-sm font-medium text-orange-700">Всего людей</span>
          </div>
          <div className="text-3xl font-bold text-orange-900">{totalCount}</div>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Icon name="Timer" size={20} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Время</span>
          </div>
          <div className="text-3xl font-bold text-blue-900 font-mono">
            {evacuationTime.toFixed(1)}<span className="text-lg">с</span>
          </div>
        </div>
      </div>

      {totalCount > 0 && evacuatedCount === totalCount && isSimulating && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white text-center shadow-lg animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Icon name="PartyPopper" size={24} />
            <span className="text-lg font-bold">Эвакуация завершена!</span>
          </div>
          <p className="text-sm opacity-90">Все люди в безопасности за {evacuationTime.toFixed(1)} секунд</p>
        </div>
      )}
    </Card>
  );
};

export default Statistics;
