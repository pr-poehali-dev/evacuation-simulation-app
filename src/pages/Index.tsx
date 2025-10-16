import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import SimulationCanvas from '@/components/SimulationCanvas';
import PeopleConfig from '@/components/PeopleConfig';
import EmergencyZones from '@/components/EmergencyZones';
import Statistics from '@/components/Statistics';
import BuildingSelector from '@/components/BuildingSelector';
import PersonEditor from '@/components/PersonEditor';
import { buildingTemplates } from '@/types/buildings';

export interface Person {
  id: string;
  x: number;
  y: number;
  type: 'adult' | 'child' | 'elderly' | 'disabled';
  speed: number;
  size: number;
  evacuated: boolean;
  path: { x: number; y: number }[];
  currentPathIndex: number;
}

export interface Room {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
}

export interface Exit {
  id: string;
  x: number;
  y: number;
  width: number;
}

export interface Emergency {
  id: string;
  x: number;
  y: number;
  radius: number;
  type: 'fire' | 'smoke' | 'collapse';
}

const Index = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [rooms, setRooms] = useState<Room[]>([
    { id: '1', x: 50, y: 50, width: 300, height: 200, name: 'Зал 1' },
    { id: '2', x: 400, y: 50, width: 250, height: 200, name: 'Зал 2' },
    { id: '3', x: 50, y: 300, width: 200, height: 150, name: 'Офис' },
    { id: '4', x: 300, y: 300, width: 350, height: 150, name: 'Коридор' },
  ]);
  const [exits, setExits] = useState<Exit[]>([
    { id: '1', x: 680, y: 220, width: 40 },
    { id: '2', x: 20, y: 220, width: 40 },
  ]);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [evacuationTime, setEvacuationTime] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState([1]);
  const [placementMode, setPlacementMode] = useState<'person' | 'emergency' | null>(null);
  const [selectedPersonType, setSelectedPersonType] = useState<Person['type']>('adult');
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<Emergency['type']>('fire');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [totalFloors, setTotalFloors] = useState(1);

  const addPerson = (type: Person['type'], x?: number, y?: number) => {
    const speedMap = {
      adult: 1.5,
      child: 1.2,
      elderly: 0.8,
      disabled: 0.5,
    };
    
    let posX = x;
    let posY = y;
    
    if (posX === undefined || posY === undefined) {
      const room = rooms[Math.floor(Math.random() * rooms.length)];
      posX = room.x + Math.random() * (room.width - 20) + 10;
      posY = room.y + Math.random() * (room.height - 20) + 10;
    }
    
    const newPerson: Person = {
      id: `person-${Date.now()}-${Math.random()}`,
      x: posX,
      y: posY,
      type,
      speed: speedMap[type],
      size: type === 'child' ? 8 : type === 'disabled' ? 12 : 10,
      evacuated: false,
      path: [],
      currentPathIndex: 0,
    };
    
    setPeople(prev => [...prev, newPerson]);
  };

  const addEmergency = (type: Emergency['type'], x?: number, y?: number) => {
    let posX = x;
    let posY = y;
    
    if (posX === undefined || posY === undefined) {
      const room = rooms[Math.floor(Math.random() * rooms.length)];
      posX = room.x + room.width / 2;
      posY = room.y + room.height / 2;
    }
    
    const newEmergency: Emergency = {
      id: `emergency-${Date.now()}`,
      x: posX,
      y: posY,
      radius: type === 'fire' ? 60 : type === 'smoke' ? 80 : 50,
      type,
    };
    setEmergencies(prev => [...prev, newEmergency]);
  };

  const handleCanvasClick = (x: number, y: number) => {
    if (isSimulating) return;
    
    if (placementMode === 'person') {
      addPerson(selectedPersonType, x, y);
      setPlacementMode(null);
    } else if (placementMode === 'emergency') {
      addEmergency(selectedEmergencyType, x, y);
      setPlacementMode(null);
    }
  };

  const handlePersonClick = (person: Person) => {
    if (isSimulating) return;
    setSelectedPerson(person);
  };

  const updatePerson = (updatedPerson: Person) => {
    setPeople(prev => prev.map(p => p.id === updatedPerson.id ? { ...updatedPerson, path: [], currentPathIndex: 0 } : p));
    setSelectedPerson(null);
  };

  const deletePerson = (personId: string) => {
    setPeople(prev => prev.filter(p => p.id !== personId));
    setSelectedPerson(null);
  };

  const loadBuilding = (buildingId: string) => {
    const template = buildingTemplates.find(b => b.id === buildingId);
    if (template) {
      if (people.length > 0 || emergencies.length > 0) {
        const confirmed = window.confirm('Загрузка нового плана удалит всех людей и зоны ЧС. Продолжить?');
        if (!confirmed) return;
      }
      setRooms(template.rooms);
      setExits(template.exits);
      setTotalFloors(template.floors);
      setCurrentFloor(1);
      setPeople([]);
      setEmergencies([]);
      setPlacementMode(null);
      setSelectedPerson(null);
      resetSimulation();
    }
  };

  const startSimulation = () => {
    setIsSimulating(true);
    setEvacuationTime(0);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setPeople(prev => prev.map(p => ({ ...p, evacuated: false, path: [], currentPathIndex: 0 })));
    setEvacuationTime(0);
  };

  const evacuatedCount = people.filter(p => p.evacuated).length;
  const evacuationProgress = people.length > 0 ? (evacuatedCount / people.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <header className="text-center space-y-3 pt-4">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-2xl shadow-lg">
              <Icon name="Flame" className="text-white" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Симулятор Эвакуации
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Моделирование эвакуации людей при чрезвычайных ситуациях</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 shadow-xl bg-white/80 backdrop-blur border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge variant={isSimulating ? "destructive" : "secondary"} className="px-3 py-1">
                    {isSimulating ? 'Симуляция идет' : 'Готов к запуску'}
                  </Badge>
                  {isSimulating && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon name="Clock" size={16} />
                      <span className="font-mono font-semibold">{evacuationTime.toFixed(1)}с</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {!isSimulating ? (
                    <Button 
                      onClick={startSimulation} 
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
                      disabled={people.length === 0}
                    >
                      <Icon name="Play" size={18} className="mr-2" />
                      Старт
                    </Button>
                  ) : (
                    <Button 
                      onClick={stopSimulation}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Icon name="Pause" size={18} className="mr-2" />
                      Пауза
                    </Button>
                  )}
                  <Button 
                    onClick={resetSimulation}
                    variant="outline"
                    className="border-gray-300"
                  >
                    <Icon name="RotateCcw" size={18} className="mr-2" />
                    Сброс
                  </Button>
                </div>
              </div>

              <SimulationCanvas
                people={people}
                setPeople={setPeople}
                rooms={rooms}
                exits={exits}
                emergencies={emergencies}
                isSimulating={isSimulating}
                evacuationTime={evacuationTime}
                setEvacuationTime={setEvacuationTime}
                simulationSpeed={simulationSpeed[0]}
                onCanvasClick={handleCanvasClick}
                onPersonClick={handlePersonClick}
                placementMode={placementMode}
                currentFloor={currentFloor}
              />

              {totalFloors > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <span className="text-sm text-gray-600">Этаж:</span>
                  <div className="flex gap-2">
                    {Array.from({ length: totalFloors }, (_, i) => i + 1).map(floor => (
                      <Button
                        key={floor}
                        variant={currentFloor === floor ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentFloor(floor)}
                        className="w-10"
                      >
                        {floor}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Прогресс эвакуации</span>
                  <span className="font-semibold text-gray-900">{evacuatedCount} / {people.length}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 rounded-full"
                    style={{ width: `${evacuationProgress}%` }}
                  />
                </div>
              </div>
            </Card>

            <Statistics 
              people={people}
              evacuationTime={evacuationTime}
              isSimulating={isSimulating}
            />
          </div>

          <div className="space-y-6">
            <BuildingSelector onSelectBuilding={loadBuilding} />

            <Card className="p-6 shadow-xl bg-white/80 backdrop-blur border-gray-200">
              <Tabs defaultValue="people" className="w-full">
                <TabsList className="grid grid-cols-3 w-full mb-4">
                  <TabsTrigger value="people" className="flex items-center gap-2">
                    <Icon name="Users" size={16} />
                    Люди
                  </TabsTrigger>
                  <TabsTrigger value="emergency" className="flex items-center gap-2">
                    <Icon name="AlertTriangle" size={16} />
                    ЧС
                  </TabsTrigger>
                  <TabsTrigger value="building" className="flex items-center gap-2">
                    <Icon name="Building" size={16} />
                    План
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="people" className="space-y-4">
                  <PeopleConfig 
                    onAddPerson={addPerson} 
                    peopleCount={people.length}
                    placementMode={placementMode}
                    onSetPlacementMode={(type) => {
                      setPlacementMode('person');
                      setSelectedPersonType(type);
                    }}
                    onCancelPlacement={() => setPlacementMode(null)}
                  />
                </TabsContent>

                <TabsContent value="emergency" className="space-y-4">
                  <EmergencyZones 
                    onAddEmergency={addEmergency} 
                    emergencies={emergencies}
                    onRemoveEmergency={(id) => setEmergencies(prev => prev.filter(e => e.id !== id))}
                    placementMode={placementMode}
                    onSetPlacementMode={(type) => {
                      setPlacementMode('emergency');
                      setSelectedEmergencyType(type);
                    }}
                    onCancelPlacement={() => setPlacementMode(null)}
                  />
                </TabsContent>

                <TabsContent value="building" className="space-y-4">
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">План: {rooms.length} помещений, {exits.length} выходов</p>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                        <p className="text-xs text-blue-700">
                          Выберите готовый план здания из библиотеки выше или используйте текущий.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {selectedPerson && (
              <PersonEditor
                person={selectedPerson}
                onUpdate={updatePerson}
                onDelete={deletePerson}
                onClose={() => setSelectedPerson(null)}
              />
            )}

            <Card className="p-6 shadow-xl bg-white/80 backdrop-blur border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="Settings" size={20} />
                Настройки симуляции
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-600">Скорость симуляции</label>
                    <span className="text-sm font-semibold text-gray-900">{simulationSpeed[0]}x</span>
                  </div>
                  <Slider 
                    value={simulationSpeed} 
                    onValueChange={setSimulationSpeed}
                    min={0.5}
                    max={3}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;