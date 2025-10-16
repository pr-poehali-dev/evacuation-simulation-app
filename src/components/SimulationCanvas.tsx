import { useEffect, useRef } from 'react';
import type { Person, Room, Exit, Emergency, SafeZone } from '@/pages/Index';

interface SimulationCanvasProps {
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
  rooms: Room[];
  exits: Exit[];
  emergencies: Emergency[];
  safeZones: SafeZone[];
  isSimulating: boolean;
  evacuationTime: number;
  setEvacuationTime: React.Dispatch<React.SetStateAction<number>>;
  simulationSpeed: number;
  onCanvasClick: (x: number, y: number) => void;
  onPersonClick: (person: Person) => void;
  placementMode: 'person' | 'emergency' | 'room' | 'exit' | 'safezone' | null;
  currentFloor: number;
  drawStart: { x: number; y: number } | null;
  isDrawingRoom: boolean;
  allPeople: Person[];
}

const SimulationCanvas = ({
  people,
  setPeople,
  rooms,
  exits,
  emergencies,
  safeZones,
  isSimulating,
  evacuationTime,
  setEvacuationTime,
  simulationSpeed,
  onCanvasClick,
  onPersonClick,
  placementMode,
  currentFloor,
  drawStart,
  isDrawingRoom,
  allPeople,
}: SimulationCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

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

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    mousePos.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const isPointInRoom = (x: number, y: number, room: Room): boolean => {
    return x >= room.x && x <= room.x + room.width && y >= room.y && y <= room.y + room.height;
  };

  const findPath = (person: Person, exits: Exit[], rooms: Room[], emergencies: Emergency[]): { x: number; y: number }[] => {
    const nearestExit = exits.reduce((nearest, exit) => {
      const distToExit = Math.hypot(exit.x - person.x, exit.y - person.y);
      const nearestDist = Math.hypot(nearest.x - person.x, nearest.y - person.y);
      return distToExit < nearestDist ? exit : nearest;
    });

    const path: { x: number; y: number }[] = [];
    const currentRoom = rooms.find(room => isPointInRoom(person.x, person.y, room));
    
    if (currentRoom) {
      const doorX = currentRoom.x + currentRoom.width;
      const doorY = currentRoom.y + currentRoom.height / 2;
      
      const stepsToDoор = 10;
      for (let i = 1; i <= stepsToDoор; i++) {
        const t = i / stepsToDoор;
        path.push({
          x: person.x + (doorX - person.x) * t,
          y: person.y + (doorY - person.y) * t,
        });
      }
    }

    const steps = 15;
    const startX = currentRoom ? currentRoom.x + currentRoom.width : person.x;
    const startY = currentRoom ? currentRoom.y + currentRoom.height / 2 : person.y;
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      let x = startX + (nearestExit.x - startX) * t;
      let y = startY + (nearestExit.y - startY) * t;

      emergencies.forEach(emergency => {
        if (emergency.floor !== currentFloor) return;
        const dist = Math.hypot(emergency.x - x, emergency.y - y);
        if (dist < emergency.radius + 30) {
          const angle = Math.atan2(y - emergency.y, x - emergency.x);
          const avoidDist = emergency.radius + 30 - dist;
          x += Math.cos(angle) * avoidDist * 1.5;
          y += Math.sin(angle) * avoidDist * 1.5;
        }
      });

      path.push({ x, y });
    }

    return path;
  };

  useEffect(() => {
    if (!isSimulating) return;

    setPeople(prevPeople => prevPeople.map(person => {
      if (person.evacuated || person.floor !== currentFloor) return person;
      if (person.path.length === 0) {
        const currentFloorRooms = rooms.filter(r => !r.name.includes('этаж') || r.name.includes(`${currentFloor} этаж`));
        return { ...person, path: findPath(person, exits, currentFloorRooms, emergencies) };
      }
      return person;
    }));
  }, [isSimulating]);

  const currentRooms = rooms.filter(room => {
    if (!room.name.includes('этаж')) return true;
    const floorMatch = room.name.match(/(\d+) этаж/);
    return floorMatch ? parseInt(floorMatch[1]) === currentFloor : true;
  });

  const currentEmergencies = emergencies.filter(e => e.floor === currentFloor);

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

      safeZones.forEach(zone => {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
        ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
        ctx.setLineDash([]);

        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(zone.name, zone.x + zone.width / 2, zone.y + zone.height / 2);
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

      currentEmergencies.forEach(emergency => {
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

        if (person.groupId) {
          const groupMembers = allPeople.filter(p => p.groupId === person.groupId && !p.evacuated);
          if (groupMembers.length > 1) {
            ctx.strokeStyle = `${colorMap[person.type]}30`;
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            groupMembers.forEach((member, idx) => {
              if (idx === 0) ctx.moveTo(member.x, member.y);
              else ctx.lineTo(member.x, member.y);
            });
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }

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

      if (drawStart && (placementMode === 'room' || placementMode === 'safezone')) {
        const width = mousePos.current.x - drawStart.x;
        const height = mousePos.current.y - drawStart.y;
        
        ctx.strokeStyle = placementMode === 'safezone' ? '#22c55e' : '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(drawStart.x, drawStart.y, width, height);
        ctx.setLineDash([]);
        
        ctx.fillStyle = placementMode === 'safezone' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)';
        ctx.fillRect(drawStart.x, drawStart.y, width, height);
      }
    };

    const animate = () => {
      if (isSimulating) {
        setPeople(prevPeople => {
          return prevPeople.map(person => {
            if (person.evacuated || person.floor !== currentFloor) return person;

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
              let newX = person.x + Math.cos(angle) * person.speed * simulationSpeed;
              let newY = person.y + Math.sin(angle) * person.speed * simulationSpeed;

              prevPeople.forEach(other => {
                if (other.id === person.id || other.evacuated || other.floor !== person.floor) return;
                const dist = Math.hypot(other.x - newX, other.y - newY);
                const minDist = person.size + other.size + 2;
                if (dist < minDist) {
                  const pushAngle = Math.atan2(newY - other.y, newX - other.x);
                  newX = other.x + Math.cos(pushAngle) * minDist;
                  newY = other.y + Math.sin(pushAngle) * minDist;
                }
              });

              return {
                ...person,
                x: newX,
                y: newY,
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
  }, [people, currentRooms, exits, currentEmergencies, safeZones, isSimulating, simulationSpeed, currentFloor, drawStart, mousePos.current, allPeople]);

  return (
    <div className="relative rounded-xl overflow-hidden shadow-inner bg-gray-100 border-2 border-gray-200">
      <canvas
        ref={canvasRef}
        width={720}
        height={500}
        className="w-full h-auto cursor-crosshair"
        onClick={handleCanvasClickInternal}
        onMouseMove={handleMouseMove}
      />
      {placementMode && (
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg border border-gray-300">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {placementMode === 'person' && 'Режим размещения людей'}
            {placementMode === 'emergency' && 'Режим размещения зон ЧС'}
            {placementMode === 'room' && 'Режим рисования комнат'}
            {placementMode === 'exit' && 'Режим добавления выходов'}
            {placementMode === 'safezone' && 'Режим создания зоны сбора'}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {(placementMode === 'room' || placementMode === 'safezone') ? 'Кликните дважды для границ' : 'Кликните на план'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SimulationCanvas;
