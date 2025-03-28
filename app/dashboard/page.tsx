import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, TrendingUp, Users, Mail } from 'lucide-react';

export default function DashboardPage() {
  // Normally we would fetch this data from an API
  const mockNewsletters = [
    {
      id: '1',
      title: 'Weekly Tech Updates',
      date: 'Feb 28, 2024',
      status: 'published',
      subscribers: 342,
    },
    {
      id: '2',
      title: 'Product Announcements',
      date: 'Mar 15, 2024',
      status: 'draft',
      subscribers: 208,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your newsletters.</p>
          </div>
          <Button className="w-full md:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Newsletter
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">550</div>
              <p className="text-xs text-muted-foreground">
                +18% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47.3%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Letters Sent</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                8 sent this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Newsletters */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Newsletters</CardTitle>
              <CardDescription>Manage and track your newsletter performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNewsletters.map((newsletter) => (
                  <div 
                    key={newsletter.id} 
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="space-y-1">
                      <h3 className="font-medium">{newsletter.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{newsletter.date}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{newsletter.subscribers} subscribers</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={newsletter.status === 'published' ? 'default' : 'secondary'}>
                        {newsletter.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
                {mockNewsletters.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No newsletters yet</p>
                    <Button variant="secondary" className="mt-2">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create your first newsletter
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}