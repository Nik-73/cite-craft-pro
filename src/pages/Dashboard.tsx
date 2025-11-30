import { Users, FileText, Activity, DollarSign } from 'lucide-react'

export default function Dashboard() {
  const stats = [
    {
      label: 'Total Members',
      value: '1,234',
      change: '+12.5%',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Active Proposals',
      value: '8',
      change: '+2',
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      label: 'Treasury Value',
      value: '$2.4M',
      change: '+8.2%',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      label: 'Participation Rate',
      value: '68%',
      change: '+5.3%',
      icon: Activity,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your DAO overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Proposals</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Proposal #{i}</h3>
                    <p className="text-sm text-gray-600 mt-1">Allocate funds for development</p>
                  </div>
                  <span className="badge badge-info">Active</span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                  <span>For: 65%</span>
                  <span>Against: 35%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: 'New proposal created', time: '2 hours ago' },
              { action: 'Proposal #5 executed', time: '5 hours ago' },
              { action: 'Treasury transaction', time: '1 day ago' },
              { action: 'New member joined', time: '2 days ago' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-3 border-l-2 border-primary-500 bg-gray-50">
                <span className="text-sm text-gray-900">{activity.action}</span>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
