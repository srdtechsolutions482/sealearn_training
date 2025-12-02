import React from 'react';
import { Card, Button } from '../common/UI';
import { PlayCircle, Download } from 'lucide-react';

export const SeafarerMyLearning = () => {
  const myCourses = [
      { id: 1, title: 'Basic Safety Training', progress: 75, lastAccessed: '2 days ago', image: 'https://picsum.photos/seed/1/100/100' },
      { id: 2, title: 'Advanced Fire Fighting', progress: 10, lastAccessed: '1 week ago', image: 'https://picsum.photos/seed/2/100/100' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Learning</h2>

      <div className="space-y-4">
        {myCourses.map((course) => (
          <Card key={course.id} className="flex flex-col md:flex-row gap-6 items-center">
            <img src={course.image} alt={course.title} className="w-full md:w-32 h-32 object-cover rounded-lg" />
            <div className="flex-1 w-full">
                <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-3">Last accessed: {course.lastAccessed}</p>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
                <div className="text-right text-xs text-gray-600 mb-3">{course.progress}% Complete</div>

                <div className="flex gap-3">
                    <Button className="flex-1 md:flex-none"><PlayCircle size={18}/> Continue</Button>
                    <Button variant="outline" className="flex-1 md:flex-none"><Download size={18}/> Resources</Button>
                </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};