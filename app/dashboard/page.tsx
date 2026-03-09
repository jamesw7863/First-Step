import { getServiceClient } from "@/lib/supabase/admin";

async function getStats() {
  const supabase = getServiceClient();
  const [{ count: users }, { count: internships }, { count: digests }] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("internships").select("id", { count: "exact", head: true }),
    supabase.from("digests").select("id", { count: "exact", head: true })
  ]);

  return {
    users: users ?? 0,
    internships: internships ?? 0,
    digests: digests ?? 0
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <main>
      <section className="card">
        <h1 style={{ marginTop: 0 }}>InternList Dashboard</h1>
        <div className="grid">
          <div className="card">
            <h3>Total Users</h3>
            <p>{stats.users}</p>
          </div>
          <div className="card">
            <h3>Internships Indexed</h3>
            <p>{stats.internships}</p>
          </div>
          <div className="card">
            <h3>Digests Sent</h3>
            <p>{stats.digests}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
