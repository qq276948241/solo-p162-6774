import { Clock } from "lucide-react";
import { PICKUP_TIME_SLOTS, type PickupTimeSlot } from "@/types";

interface TimeSlotPickerProps {
  value: PickupTimeSlot | null;
  onChange: (slot: PickupTimeSlot) => void;
}

export default function TimeSlotPicker({ value, onChange }: TimeSlotPickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-stone-700">
        <Clock className="w-4 h-4 text-forest" />
        <span className="font-medium">选择明早取货时段</span>
        <span className="text-xs text-stone-400">（8:00 - 12:00）</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {PICKUP_TIME_SLOTS.map((slot) => {
          const selected = value === slot;
          return (
            <button
              key={slot}
              onClick={() => onChange(slot)}
              className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 border
                ${
                  selected
                    ? "bg-forest text-white border-forest shadow-md shadow-forest/20"
                    : "bg-white text-stone-600 border-caramel-100 hover:border-forest hover:text-forest"
                }`}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}
