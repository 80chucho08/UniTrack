import ScheduleSlot from "./ScheduleSlot";

const days = ["Lun", "Mar", "Mié", "Jue", "Vie"];
const hours = [7, 8, 9, 10, 11, 12];

export default function ScheduleGrid({ assigned }: any) {
    return (
        <div className="grid grid-cols-6 gap-2">
            <div />
            {days.map(day => (
                <div key={day} className="font-bold text-center">
                    {day}
                </div>
            ))}

            {hours.map(hour => (
                <React.Fragment key={hour}> {/* Usa Fragment con key */}
                    <div className="font-bold flex items-center justify-center border-t">
                        {hour}:00
                    </div>
                    {days.map(day => {
                        const slotId = `${day}-${hour}`;
                        return (
                            <ScheduleSlot
                                key={slotId}
                                id={slotId}
                                subject={assigned[slotId]}
                            />
                        );
                    })}
                </React.Fragment>
            ))}
        </div>
    );
}
