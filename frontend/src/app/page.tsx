// src/app/page.tsx

type Project = {
  id: string;
  title: string;
  description: string;
  budget: number;
  skillsRequired: string[];
  // Renamed to match the freelancer platform concept and backend response
  client: {
    name: string;
    email: string;
  };
  freelancer: {
    name: string;
    email: string;
  } | null;
  status: string;
};

// Renamed from getJobs
async function getProjects(): Promise<Project[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined in .env.local");
  }
 
  const res = await fetch(apiUrl, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data from the API. Ensure the backend is running and the URL is correct.');
  }

  // The backend now returns 'creator' and 'candidate', which we map to 'client' and 'freelancer'
  const data = await res.json();
  return data.map((project: any) => ({
    ...project,
    client: project.creator,
    freelancer: project.candidate
  }));
}

export default async function HomePage() {
  // Renamed from 'jobs'
  const projects = await getProjects();

  return (
    <main className="container mx-auto p-8">
      {/* Changed heading */}
      <h1 className="text-4xl font-bold mb-6">Available Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Changed mapping variable */}
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg p-4 shadow-md bg-white">
            <h2 className="text-2xl font-semibold">{project.title}</h2>
            <p className="text-gray-600 mt-2">{project.description}</p>
            <div className="mt-4">
              <span className="font-bold">Budget:</span> ${project.budget}
            </div>
            <div className="mt-2">
              <span className="font-bold">Status:</span>
              <span className={`ml-2 px-2 py-1 text-sm rounded-full ${
                project.status === 'ASSIGNED' 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-yellow-200 text-yellow-800'
              }`}>
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}