// src/components/ProjectCard.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

type ProjectCardProps = {
  project: any;
  handleEdit: (project: any) => void;
  handleDeleteClick: (id: string) => void;
  handleToggleProject: (id: string) => void;
  selectedProjectId: string | null;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  handleEdit,
  handleDeleteClick,
  handleToggleProject,
  selectedProjectId
}) => {
  return (
    <div
      key={project.id}
      className="p-6 bg-white/20 text-black rounded-xl shadow-lg transform transition-transform duration-300 ease-in-out"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-2xl text-gray-100">{project.name}</h3>
          <p className="text-sm text-gray-200">{project.description}</p>
        </div>
        <div className="space-x-3">
          <Button
            variant="ghost"
            onClick={() => handleEdit(project)}
            className="text-blue-500 hover:bg-blue-700 p-2 rounded-full transition duration-300"
          >
            <Pencil className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleDeleteClick(project.id)}
            className="text-red-500 hover:bg-red-700 p-2 rounded-full transition duration-300"
          >
            <Trash2 className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => handleToggleProject(project.id)}
            className="text-white cursor-pointer p-2 rounded-full transition duration-300"
          >
            {selectedProjectId === project.id ? "Hide Tasks" : "Show Tasks"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
