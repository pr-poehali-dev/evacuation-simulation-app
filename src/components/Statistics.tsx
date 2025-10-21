import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import type { Person } from '@/pages/Index';

interface StatisticsProps {
  people: Person[];
  evacuationTime: number;
  isSimulating: boolean;
  groupEvacuationTimes?: Map<string, number>;
}

const Statistics = ({ people, evacuationTime, isSimulating, groupEvacuationTimes }: StatisticsProps) => {
  const evacuatedCount = people.filter(p => p.evacuated).length;
  const totalCount = people.length;

  // Собираем информацию о группах
  const groups = new Map<string, Person[]>();
  people.forEach(person => {
    if (person.groupId) {
      if (!groups.has(person.groupId)) {
        groups.set(person.groupId, []);
      }
      groups.get(person.groupId)!.push(person);
    }
  });

  const groupsArray = Array.from(groups.entries()).map(([groupId, members]) => {
    const allEvacuated = members.every(m => m.evacuated);
    const evacuationTime = groupEvacuationTimes?.get(groupId);
    return {
      groupId,
      members,
      size: members.length,
      allEvacuated,
      evacuationTime,
    };
  }).sort((a, b) => {
    // Сначала эвакуированные, затем по времени эвакуации
    if (a.allEvacuated && !b.allEvacuated) return -1;
    if (!a.allEvacuated && b.allEvacuated) return 1;
    if (a.evacuationTime && b.evacuationTime) return a.evacuationTime - b.evacuationTime;
    return 0;
  });

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

      {groupsArray.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-semibold mb-3 flex items-center gap-2 text-gray-700">
            <Icon name="Users" size={18} />
            Статистика групп ({groupsArray.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {groupsArray.map((group, index) => (
              <div
                key={group.groupId}
                className={`p-3 rounded-lg border-2 transition-all ${
                  group.allEvacuated
                    ? 'bg-green-50 border-green-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      group.allEvacuated ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">
                        Группа {index + 1}
                      </div>
                      <div className="text-xs text-gray-500">
                        {group.size} {group.size === 1 ? 'человек' : group.size < 5 ? 'человека' : 'человек'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {group.allEvacuated ? (
                      <div className="flex items-center gap-1">
                        <Icon name="CheckCircle" size={16} className="text-green-600" />
                        {group.evacuationTime !== undefined && (
                          <span className="text-sm font-bold text-green-700 font-mono">
                            {group.evacuationTime.toFixed(1)}с
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Icon name="Clock" size={16} className="text-orange-500" />
                        <span className="text-xs text-orange-600">в процессе</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex gap-1">
                  {group.members.map(member => (
                    <div
                      key={member.id}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        member.evacuated ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                      title={`${member.type} - ${member.evacuated ? 'эвакуирован' : 'эвакуируется'}`}
                    >
                      {member.type === 'adult' && '👤'}
                      {member.type === 'child' && '👶'}
                      {member.type === 'elderly' && '👴'}
                      {member.type === 'disabled' && '♿'}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default Statistics;