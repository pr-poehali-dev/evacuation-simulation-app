import { useEffect, useRef } from 'react';
import type { Person, Room, Exit, Emergency } from '@/pages/Index';

interface SimulationCanvasProps {
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
  rooms: Room[];
  exits: Exit[];
  emergencies: Emergency[];
  isSimulating: boolean;
  evacuationTime: number;
  setEvacuationTime: React.Dispatch<React.SetStateAction<number>>;
  simulationSpeed: number;
  onCanvasClick: (x: number, y: number) => void;
  onPersonClick: (person: Person) => void;
  placementMode: 'person' | 'emergency' | null;
  currentFloor: number;
}

const SimulationCanvas = ({
  people,
  setPeople,
  rooms,
  exits,
  emergencies,
  isSimulating,
  evacuationTime,
  setEvacuationTime,
  simulationSpeed,
  onCanvasClick,
  onPersonClick,
  placementMode,
  currentFloor,
}: SimulationCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  const handleCanvasClickInternal = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const clickedPerson = people.find(person => {
      const dist = Math.hypot(person.x - x, person.y - y);
      return dist <= person.size + 5;
    });

    if (clickedPerson) {
      onPersonClick(clickedPerson);
    } else {
      onCanvasClick(x, y);
    }
  };

  const findPath = (person: Person, exits: Exit[], emergencies: Emergency[]): { x: number; y: number }[] => {
    const nearestExit = exits.reduce((nearest, exit) => {
      const distToExit = Math.hypot(exit.x - person.x, exit.y - person.y);
      const nearestDist = Math.hypot(nearest.x - person.x, nearest.y - person.y);
      return distToExit < nearestDist ? exit : nearest;
    });

    const path: { x: number; y: number }[] = [];
    const steps = 20;
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      let x = person.x + (nearestExit.x - person.x) * t;
      let y = person.y + (nearestExit.y - person.y) * t;

      emergencies.forEach(emergency => {
        const dist = Math.hypot(emergency.x - x, emergency.y - y);
        if (dist < emergency.radius + 30) {
          const angle = Math.atan2(y - emergency.y, x - emergency.x);
          const avoidDist = emergency.radius + 30 - dist;
          x += Math.cos(angle) * avoidDist;
          y += Math.sin(angle) * avoidDist;
        }
      });

      path.push({ x, y });
    }

    return path;
  };

  useEffect(() => {
    if (!isSimulating) return;

    setPeople(prevPeople => prevPeople.map(person => {
      if (person.evacuated) return person;
      if (person.path.length === 0) {
        return { ...person, path: findPath(person, exits, emergencies) };
      }
      return person;
    }));
  }, [isSimulating]);

  const currentRooms = rooms.filter(room => {
    if (!room.name.includes('этаж')) return true;
    const floorMatch = room.name.match(/(\d+) этаж/);
    return floorMatch ? parseInt(floorMatch[1]) === currentFloor : true;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#f9fafb';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      currentRooms.forEach(room => {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 2;
        ctx.fillRect(room.x, room.y, room.width, room.height);
        ctx.strokeRect(room.x, room.y, room.width, room.height);

        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(room.name, room.x + room.width / 2, room.y + room.height / 2);
      });

      exits.forEach(exit => {
        const gradient = ctx.createLinearGradient(exit.x, 0, exit.x + exit.width, 0);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#059669');
        ctx.fillStyle = gradient;
        ctx.fillRect(exit.x, exit.y - 10, exit.width, 20);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('EXIT', exit.x + exit.width / 2, exit.y + 5);
      });

      emergencies.forEach(emergency => {
        const gradient = ctx.createRadialGradient(
          emergency.x, emergency.y, 0,
          emergency.x, emergency.y, emergency.radius
        );
        
        if (emergency.type === 'fire') {
          gradient.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
          gradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.3)');
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        } else if (emergency.type === 'smoke') {
          gradient.addColorStop(0, 'rgba(107, 114, 128, 0.6)');
          gradient.addColorStop(0.5, 'rgba(107, 114, 128, 0.3)');
          gradient.addColorStop(1, 'rgba(107, 114, 128, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(251, 146, 60, 0.6)');
          gradient.addColorStop(0.5, 'rgba(251, 146, 60, 0.3)');
          gradient.addColorStop(1, 'rgba(251, 146, 60, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(emergency.x, emergency.y, emergency.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = emergency.type === 'fire' ? '#ef4444' : emergency.type === 'smoke' ? '#6b7280' : '#fb923c';
        ctx.font = 'bold 24px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(emergency.type === 'fire' ? '🔥' : emergency.type === 'smoke' ? '💨' : '⚠️', emergency.x, emergency.y + 8);
      });

      people.forEach(person => {
        if (person.evacuated) return;

        const colorMap = {
          adult: '#3b82f6',
          child: '#f59e0b',
          elderly: '#8b5cf6',
          disabled: '#ec4899',
        };

        ctx.fillStyle = colorMap[person.type];
        ctx.beginPath();
        ctx.arc(person.x, person.y, person.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (person.path.length > 0 && person.currentPathIndex < person.path.length - 1) {
          ctx.strokeStyle = `${colorMap[person.type]}40`;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(person.x, person.y);
          for (let i = person.currentPathIndex; i < person.path.length; i++) {
            ctx.lineTo(person.path[i].x, person.path[i].y);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
    };

    const animate = () => {
      if (isSimulating) {
        setPeople(prevPeople => {
          return prevPeople.map(person => {
            if (person.evacuated) return person;

            if (person.path.length > 0 && person.currentPathIndex < person.path.length) {
              const target = person.path[person.currentPathIndex];
              const dx = target.x - person.x;
              const dy = target.y - person.y;
              const distance = Math.hypot(dx, dy);

              if (distance < person.speed * simulationSpeed) {
                if (person.currentPathIndex === person.path.length - 1) {
                  return { ...person, evacuated: true };
                }
                return {
                  ...person,
                  x: target.x,
                  y: target.y,
                  currentPathIndex: person.currentPathIndex + 1,
                };
              }

              const angle = Math.atan2(dy, dx);
              return {
                ...person,
                x: person.x + Math.cos(angle) * person.speed * simulationSpeed,
                y: person.y + Math.sin(angle) * person.speed * simulationSpeed,
              };
            }

            return person;
          });
        });

        setEvacuationTime(prev => prev + 0.016 * simulationSpeed);
      }

      render();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [people, currentRooms, exits, emergencies, isSimulating, simulationSpeed, currentFloor]);

  return (
    <div className="relative rounded-xl overflow-hidden shadow-inner bg-gray-100 border-2 border-gray-200">
      <canvas
        ref={canvasRef}
        width={720}
        height={500}
        className="w-full h-auto cursor-crosshair"
        onClick={handleCanvasClickInternal}
      />
      {placementMode && (
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg border border-gray-300">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {placementMode === 'person' ? 'Режим размещения людей' : 'Режим размещения зон ЧС'}
          </div>
          <p className="text-xs text-gray-500 mt-1">Кликните на план для размещения</p>
        </div>
      )}
    </div>
  );
};

export default SimulationCanvas;