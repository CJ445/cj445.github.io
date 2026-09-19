import React from 'react';
import { FaExternalLinkAlt, FaMediumM } from 'react-icons/fa';


const BlogCard = ({ title, snippet, date, link, color }: any) => (
  <div className={`border-4 border-black shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col h-full relative bg-white`}>


    <div className={`border-b-4 border-black px-3 py-2 flex justify-between items-center ${color}`}>
      <div className="flex gap-2">

        <div className="w-3 h-3 rounded-full bg-white border-2 border-black"></div>
        <div className="w-3 h-3 rounded-full bg-white border-2 border-black"></div>
        <div className="w-3 h-3 rounded-full bg-white border-2 border-black"></div>
      </div>
      <span className="font-mono text-[10px] font-black uppercase tracking-widest">
        article.exe
      </span>
    </div>


    <div className="p-6 flex flex-col flex-grow justify-between">
      <div>
        <div className="flex justify-between items-start mb-4 gap-4">
          <h3 className="text-xl font-bold leading-snug">{title}</h3>
          <FaMediumM className="text-3xl flex-shrink-0" />
        </div>
        <p className="text-sm font-medium mb-6 text-gray-700 leading-relaxed">
          {snippet}
        </p>
      </div>


      <div className="flex items-center justify-between mt-auto pt-4 border-t-4 border-black border-dashed">
        <span className="bg-gray-100 border border-black px-2 py-1 text-xs font-bold font-mono">
          {date}
        </span>

        <a href={link} target="_blank" rel="noreferrer" className="bg-black text-white px-4 py-2 font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors border-2 border-black hover:text-custom-yellow">
          Read <FaExternalLinkAlt className="text-xs" />
        </a>
      </div>
    </div>
  </div>
);

const Blogs = () => {
  const blogs = [
    {
      title: "How to Run RT-DETR in DeepStream",
      snippet: "A walkthrough on deploying RT-DETR object detection models inside NVIDIA's DeepStream SDK for real-time inference pipelines.",
      date: "Medium",
      color: "bg-custom-yellow",
      link: "https://medium.com/@thecyriljacob/how-to-run-rt-detr-in-deepstream-c3e32940e71d",
    },
    {
      title: "What Is Buildspace, Anyway?",
      snippet: "A look at Buildspace and what it means to build projects in public alongside a community of makers.",
      date: "Medium",
      color: "bg-custom-blue",
      link: "https://medium.com/@thecyriljacob/what-is-buildspace-anyway-78c825742cf4",
    }
  ];

  return (
    <section id="blogs" className="py-10 px-4 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-custom-purple px-8 py-3 border-4 border-black shadow-neo  rounded-full">
          <h2 className="text-3xl font-shrikhand text-black">BLOGS</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((b, i) => (
          <BlogCard key={i} {...b} />
        ))}
      </div>
    </section>
  );
};

export default Blogs;