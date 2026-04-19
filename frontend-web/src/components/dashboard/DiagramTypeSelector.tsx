"use client";
import { motion } from "framer-motion";
  GitBranch, ArrowRight, Zap, MousePointer2, Layers, ArrowLeftRight,
  Hexagon, Users, AlignLeft, Shuffle, Map, Server, LayoutGrid,
} from "lucide-react";

  id: string;
  icon: React.ElementType;
  promptHint: string;


  { id: "process_flow",    label: "Process Flow",          icon: ArrowRight,    color: "indigo",  promptHint: "a process flow diagram for" },
  { id: "user_flow",       label: "User Flow",             icon: MousePointer2, color: "purple",  promptHint: "a user flow diagram for" },

  { id: "system_arch",     label: "System Architecture",  icon: Server,        color: "teal",    promptHint: "a detailed system architecture for" },
  { id: "uml",             label: "UML Diagram",           icon: Code2,         color: "sky",     promptHint: "a UML diagram for" },
  { id: "use_case",        label: "Use Case",              icon: User,          color: "slate",   promptHint: "a use case diagram for" },
  { id: "erd",             label: "ERD",                   icon: Database,      color: "amber",   promptHint: "an entity relationship diagram for" },

  { id: "aws",             label: "AWS Diagram",           icon: Cloud,         color: "yellow",  promptHint: "an AWS cloud architecture diagram for" },
  { id: "terraform",       label: "Terraform",             icon: FileCode,      color: "violet",  promptHint: "a Terraform infrastructure diagram for" },

  { id: "swimlane",        label: "Swimlane",              icon: AlignLeft,     color: "cyan",    promptHint: "a swimlane diagram for" },
  { id: "user_journey",    label: "User Journey Map",      icon: Map,           color: "pink",    promptHint: "a user journey map for" },
  { id: "block",           label: "Block Diagram",         icon: LayoutGrid,    color: "slate",   promptHint: "a block diagram for" },
  { id: "plantuml",        label: "PlantUML Editor",       icon: Box,           color: "violet",  promptHint: "a PlantUML diagram for" },

  blue:    { bg: "bg-blue-50",    border: "border-blue-300",    text: "text-blue-600",    iconBg: "bg-blue-100" },
  violet:  { bg: "bg-violet-50",  border: "border-violet-300",  text: "text-violet-600",  iconBg: "bg-violet-100" },
  fuchsia: { bg: "bg-fuchsia-50", border: "border-fuchsia-300", text: "text-fuchsia-600", iconBg: "bg-fuchsia-100" },
  teal:    { bg: "bg-teal-50",    border: "border-teal-300",    text: "text-teal-600",    iconBg: "bg-teal-100" },
  sky:     { bg: "bg-sky-50",     border: "border-sky-300",     text: "text-sky-600",     iconBg: "bg-sky-100" },
  orange:  { bg: "bg-orange-50",  border: "border-orange-300",  text: "text-orange-600",  iconBg: "bg-orange-100" },
  red:     { bg: "bg-red-50",     border: "border-red-300",     text: "text-red-600",     iconBg: "bg-red-100" },
  pink:    { bg: "bg-pink-50",    border: "border-pink-300",    text: "text-pink-600",    iconBg: "bg-pink-100" },
};
interface Props {
  onSelect: (type: DiagramType) => void;

  return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
          const c = COLOR_MAP[type.color] ?? COLOR_MAP.slate;

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25, delay: i * 0.015, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.97 }}
              className={clsx(
                isSelected
                  : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
                <motion.div
                  className={`absolute inset-0 rounded-xl ${c.bg}`}
                />
              <div className={clsx(
                isSelected ? c.iconBg : "bg-gray-100"
                <type.icon size={15} className={isSelected ? c.text : "text-gray-500"} />
              <span className={clsx(
                isSelected ? c.text : "text-gray-500"
                {type.label}
            </motion.button>
        })}
    </section>
}
