import React from 'react';

const SkillCategory = ({ title, skills, color }: { title: string, skills: string[], color: string }) => (
  <div className={`bg-white border-4 border-black p-5 rounded-2xl shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all relative overflow-hidden`}>
    <h3 className={`font-shrikhand text-xl mb-3 ${color} inline-block px-2 border-2 border-black rounded-md `}>
        {title}
    </h3>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span key={skill} className="bg-gray-100 px-3 py-1 rounded-full border-2 border-black text-sm font-bold hover:bg-custom-green">
          {skill}
        </span>
      ))}
    </div>
  </div>
);

const Skills = () => {
  return (
    <section id="skills" className="py-10 px-4 max-w-7xl mx-auto bg-custom-pink border-2 border-b-4 border-r-4 border-black rounded-3xl shadow-neo">
      <div className="bg-custom-yellow text-black px-8 py-3 rounded-full border-4 border-black w-fit mx-auto mb-10 shadow-neo ">
        <h2 className="text-3xl font-shrikhand">SKILLS</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkillCategory
            title="Programming"
            color="bg-custom-pink"
            skills={['Python', 'SQL', 'Shell Scripting']}
        />
        <SkillCategory
            title="Backend & Software Engineering"
            color="bg-custom-blue"
            skills={['REST APIs', 'Microservices', 'CI/CD', 'Git', 'GitHub', 'RAG Schema Design']}
        />
        <SkillCategory
            title="Databases & Distributed Systems"
            color="bg-custom-green"
            skills={['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Apache Kafka', 'MQTT', 'ChromaDB', 'HNSW Indexing']}
        />
        <SkillCategory
            title="Cloud & Infrastructure"
            color="bg-custom-yellow"
            skills={['Azure', 'Azure DevOps', 'Azure Repos', 'Azure Container Registry', 'Docker', 'Kubernetes', 'Linux', 'Ubuntu', 'Netplan', 'Networking', 'SSH', 'Grafana']}
        />
        <SkillCategory
            title="AI/ML & Computer Vision"
            color="bg-purple-300"
            skills={['PyTorch', 'TensorFlow', 'Keras', 'scikit-learn', 'OpenCV', 'ONNX', 'TensorRT', 'NVIDIA DeepStream SDK', 'YOLOv8', 'Mask R-CNN', 'CLIP', 'RasterIO']}
        />

      </div>
    </section>
  );
};

export default Skills;