import React from 'react';
import { BookOpen, Users, DollarSign, Calendar, HelpCircle, GraduationCap, TrendingUp, Clock } from 'lucide-react';
import Navbar from '@/components/Common/Navbar';

// Mock admission data
const admissionData = {
  courses: [
    { id: 1, name: 'Computer Science & Engineering', duration: '4 years', seats: 120, filled: 98 },
    { id: 2, name: 'Electrical & Electronics Engineering', duration: '4 years', seats: 80, filled: 65 },
    { id: 3, name: 'Mechanical Engineering', duration: '4 years', seats: 60, filled: 48 },
    { id: 4, name: 'Business Administration (BBA)', duration: '3 years', seats: 100, filled: 82 },
    { id: 5, name: 'Bachelor of Commerce', duration: '3 years', seats: 150, filled: 120 },
    { id: 6, name: 'Bachelor of Science (Physics)', duration: '3 years', seats: 50, filled: 35 },
  ],
  eligibility: [
    { program: 'Engineering', minPercentage: 60, subjects: 'PCM (Physics, Chemistry, Mathematics)', entranceExam: 'JEE Main / State CET' },
    { program: 'Business', minPercentage: 55, subjects: 'Any stream', entranceExam: 'College Aptitude Test' },
    { program: 'Science', minPercentage: 55, subjects: 'Science stream preferred', entranceExam: 'College Aptitude Test' },
    { program: 'Arts', minPercentage: 50, subjects: 'Any stream', entranceExam: 'Not Required' },
  ],
  fees: [
    { program: 'Engineering', tuition: 12000, hostel: 3000, other: 1500, total: 16500 },
    { program: 'Business', tuition: 10000, hostel: 3000, other: 1200, total: 14200 },
    { program: 'Science', tuition: 8000, hostel: 3000, other: 1000, total: 12000 },
    { program: 'Arts', tuition: 6000, hostel: 3000, other: 800, total: 9800 },
  ],
  deadlines: [
    { event: 'Application Opens', date: 'Jan 15, 2025', status: 'completed' },
    { event: 'Early Bird Deadline', date: 'Feb 28, 2025', status: 'completed' },
    { event: 'Regular Application Deadline', date: 'Mar 30, 2025', status: 'upcoming' },
    { event: 'Late Application (with fee)', date: 'Apr 05, 2025', status: 'upcoming' },
    { event: 'Entrance Examination', date: 'Apr 15, 2025', status: 'upcoming' },
    { event: 'Results Announcement', date: 'Apr 25, 2025', status: 'upcoming' },
    { event: 'Counseling & Seat Allotment', date: 'May 01-15, 2025', status: 'upcoming' },
    { event: 'Classes Begin', date: 'Jul 01, 2025', status: 'upcoming' },
  ],
  faqs: [
    { question: 'Can I apply to multiple programs?', answer: 'Yes, you can apply to up to 3 programs with a single application fee.' },
    { question: 'Is there a hostel facility for outstation students?', answer: 'Yes, separate hostels for boys and girls with all modern amenities.' },
    { question: 'What scholarships are available?', answer: 'Merit scholarships (up to 50%), sports quota, and need-based financial aid.' },
    { question: 'Can I transfer from another college?', answer: 'Lateral entry is available for 2nd year with valid transcripts and NOC.' },
    { question: 'Is there placement assistance?', answer: 'Yes, 100% placement assistance with 200+ recruiting companies visiting campus.' },
  ],
};

const stats = [
  { label: 'Total Courses', value: '45+', icon: BookOpen, color: 'bg-primary/10 text-primary' },
  { label: 'Applications', value: '2,450', icon: Users, color: 'bg-success/10 text-success' },
  { label: 'Avg. Fee/Year', value: '$10,000', icon: DollarSign, color: 'bg-accent/10 text-accent' },
  { label: 'Days Left', value: '107', icon: Clock, color: 'bg-destructive/10 text-destructive' },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Manage admission data • Powered by IBM Granite • Designed for IBM Cloud Lite
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card-elevated p-5">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Courses Table */}
          <div className="card-elevated overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Courses & Seats</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Course</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Duration</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Filled/Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {admissionData.courses.map((course) => (
                    <tr key={course.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{course.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{course.duration}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(course.filled / course.seats) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {course.filled}/{course.seats}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Eligibility */}
          <div className="card-elevated overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-success" />
              <h2 className="font-semibold text-foreground">Eligibility Criteria</h2>
            </div>
            <div className="p-4 space-y-3">
              {admissionData.eligibility.map((item, index) => (
                <div key={index} className="p-4 rounded-xl bg-muted/30 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground">{item.program}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      Min {item.minPercentage}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Subjects:</span> {item.subjects}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Entrance:</span> {item.entranceExam}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Structure */}
          <div className="card-elevated overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-accent" />
              <h2 className="font-semibold text-foreground">Fee Structure (USD/Year)</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Program</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Tuition</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Hostel</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {admissionData.fees.map((fee, index) => (
                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{fee.program}</td>
                      <td className="px-6 py-4 text-sm text-right text-muted-foreground">${fee.tuition.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-right text-muted-foreground">${fee.hostel.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-right font-semibold text-foreground">${fee.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deadlines */}
          <div className="card-elevated overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-destructive" />
              <h2 className="font-semibold text-foreground">Important Deadlines</h2>
            </div>
            <div className="p-4 space-y-2">
              {admissionData.deadlines.map((deadline, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    deadline.status === 'completed' ? 'bg-muted/30' : 'bg-accent/5 border border-accent/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        deadline.status === 'completed' ? 'bg-success' : 'bg-accent'
                      }`}
                    />
                    <span className={`text-sm ${deadline.status === 'completed' ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                      {deadline.event}
                    </span>
                  </div>
                  <span className={`text-xs ${deadline.status === 'completed' ? 'text-muted-foreground' : 'text-accent font-medium'}`}>
                    {deadline.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="lg:col-span-2 card-elevated overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Frequently Asked Questions</h2>
            </div>
            <div className="p-4 grid md:grid-cols-2 gap-4">
              {admissionData.faqs.map((faq, index) => (
                <div key={index} className="p-4 rounded-xl bg-muted/30 border border-border">
                  <h3 className="font-medium text-foreground mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Powered by IBM Granite</span> • Designed for IBM Cloud Lite
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
