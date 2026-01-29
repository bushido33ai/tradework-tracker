import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Home, 
  ClipboardList, 
  MessageSquare, 
  Users, 
  Building2, 
  UserCircle, 
  Search,
  BookOpen,
  HelpCircle,
  FileText,
  Calculator,
  Calendar,
  Upload,
  CreditCard,
  PlusCircle,
  Settings,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  AlertCircle
} from "lucide-react";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const guides = [
    {
      id: "dashboard",
      icon: Home,
      title: "Dashboard Overview",
      description: "Your central hub for job statistics and insights",
      content: [
        {
          heading: "What you'll see",
          text: "The Dashboard provides a comprehensive overview of your business. View total jobs, active projects, completed work, and pending enquiries at a glance."
        },
        {
          heading: "Key Statistics",
          text: "• Total Jobs: All jobs you've created\n• Active Jobs: Currently in progress\n• Completed Jobs: Successfully finished\n• Pending Enquiries: New leads awaiting action"
        },
        {
          heading: "Charts & Analytics",
          text: "Visual charts show your completed jobs over time and profit/loss analysis to help you understand your business performance."
        }
      ],
      tips: ["Check your dashboard daily for new enquiries", "Use the charts to track seasonal trends"]
    },
    {
      id: "jobs",
      icon: ClipboardList,
      title: "Managing Jobs",
      description: "Create, track, and manage all your work projects",
      content: [
        {
          heading: "Creating a New Job",
          text: "Click the 'Add Job' button to create a new job. Fill in the job title, description, location, budget, and dates. You can also assign a day rate for labour tracking."
        },
        {
          heading: "Job Details Page",
          text: "Each job has a detailed view with multiple tabs:\n• Budget: Track your budget vs actual costs\n• Days Worked: Log work hours and calculate pay\n• Extras: Record additional work outside the original scope\n• Payments: Track payments received\n• Invoices: Upload and manage invoices\n• Designs: Attach design files and photos\n• Notes: Keep project notes and updates"
        },
        {
          heading: "Tracking Days Worked",
          text: "In the Days Worked tab, record each day of work with hours and rate. The system automatically calculates totals and running costs."
        },
        {
          heading: "Managing Extras",
          text: "Extras are additional work items agreed with the client. Add them with descriptions and amounts - they'll be included in your running total."
        },
        {
          heading: "Recording Payments",
          text: "Track all payments received against each job. The system shows your running balance and helps ensure you're paid in full."
        }
      ],
      tips: [
        "Upload invoices as soon as you receive them to keep accurate records",
        "Use the notes feature to document client communications",
        "Check the running total regularly to stay on top of profitability"
      ]
    },
    {
      id: "enquiries",
      icon: MessageSquare,
      title: "Handling Enquiries",
      description: "Convert leads into jobs efficiently",
      content: [
        {
          heading: "What are Enquiries?",
          text: "Enquiries are potential jobs - leads that come in before becoming confirmed work. Use this section to track and manage all new opportunities."
        },
        {
          heading: "Creating an Enquiry",
          text: "Add enquiries with the job title, description, location, and any measurement notes. Set a visit date if you need to quote on-site."
        },
        {
          heading: "Enquiry Status",
          text: "• Pending: New enquiry awaiting action\n• In Progress: You're working on a quote\n• Completed: Successfully converted to a job\n• Cancelled: Enquiry didn't proceed"
        },
        {
          heading: "Converting to a Job",
          text: "Once an enquiry is confirmed, you can convert it to a full job to begin tracking work and payments."
        }
      ],
      tips: [
        "Respond to enquiries quickly to improve conversion rates",
        "Add measurement notes during site visits",
        "Upload photos and designs to reference during quoting"
      ]
    },
    {
      id: "suppliers",
      icon: Users,
      title: "Supplier Management",
      description: "Keep track of your suppliers and vendors",
      content: [
        {
          heading: "Adding Suppliers",
          text: "Store contact details for all your suppliers including company name, contact person, phone, email, and address."
        },
        {
          heading: "Business Types",
          text: "Categorise suppliers by business type (e.g., Builders Merchant, Electrical Supplier, Plumbing) for easy filtering."
        },
        {
          heading: "Supplier Status",
          text: "Mark suppliers as Active or Inactive. Keep old supplier records for reference while focusing on current vendors."
        }
      ],
      tips: [
        "Keep supplier contact details up to date",
        "Note any trade account numbers in the address field"
      ]
    },
    {
      id: "customers",
      icon: Building2,
      title: "Customer Records",
      description: "Maintain your customer database",
      content: [
        {
          heading: "Customer Profiles",
          text: "Store comprehensive customer information including name, email, phone, address, and preferred contact method."
        },
        {
          heading: "Notes",
          text: "Add notes to customer profiles to record preferences, access details, or any other useful information."
        }
      ],
      tips: [
        "Record customer preferences for future reference",
        "Update contact details when customers move"
      ]
    },
    {
      id: "calendar",
      icon: Calendar,
      title: "Work Calendar",
      description: "View your jobs on a calendar",
      content: [
        {
          heading: "Calendar Views",
          text: "Switch between Month, Week, and Day views to see your scheduled work. Jobs are displayed based on their start and end dates."
        },
        {
          heading: "Job Colours",
          text: "Jobs are colour-coded by status:\n• Orange: Pending jobs\n• Blue: In Progress\n• Green: Completed\n• Grey: Cancelled"
        },
        {
          heading: "Quick Access",
          text: "Click on any job in the calendar to go directly to its details page."
        }
      ],
      tips: [
        "Use the calendar to spot scheduling conflicts",
        "Check the list view for a simpler overview"
      ]
    },
    {
      id: "profile",
      icon: UserCircle,
      title: "Your Profile",
      description: "Manage your account settings",
      content: [
        {
          heading: "Personal Details",
          text: "Update your name, email, phone number, and address. This information may be used on quotes and invoices."
        },
        {
          heading: "Account Type",
          text: "Your account type (Tradesman, Customer, or Merchant) determines which features you have access to."
        }
      ],
      tips: [
        "Keep your contact details current",
        "Use a professional email for client communications"
      ]
    }
  ];

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create my first job?",
          a: "Navigate to the Jobs page using the sidebar, then click the 'Add Job' button. Fill in the job details including title, description, location, and budget. Click 'Create Job' to save."
        },
        {
          q: "What's the difference between an Enquiry and a Job?",
          a: "An Enquiry is a potential lead - something you're quoting on or considering. A Job is confirmed work that you're actively tracking. Once an enquiry is accepted, convert it to a Job to begin full tracking."
        },
        {
          q: "Can I import existing data?",
          a: "Currently, data must be entered manually. We recommend adding your active jobs first, then backfilling historical data as needed."
        }
      ]
    },
    {
      category: "Jobs & Tracking",
      questions: [
        {
          q: "How do I track my time on a job?",
          a: "Open the job details and go to the 'Days Worked' tab. Click 'Add Day' to record the date, hours worked, and day rate. The system calculates your total automatically."
        },
        {
          q: "What are 'Extras' used for?",
          a: "Extras are additional work items agreed with the client that weren't in the original quote. Examples include extra materials, additional rooms, or scope changes. They're added to your running total."
        },
        {
          q: "How is the Running Total calculated?",
          a: "Running Total = Original Budget + Extras + (Days Worked × Day Rate) - Misc Costs. This shows your true position on each job."
        },
        {
          q: "Can I upload invoices?",
          a: "Yes! In the job details, go to the 'Invoices' tab and click 'Upload Invoice'. You can upload PDF or image files. The invoice amount is tracked separately."
        },
        {
          q: "How do I mark a job as complete?",
          a: "Edit the job and change the status to 'Completed'. The job will move to your completed jobs list and appear in your dashboard statistics."
        }
      ]
    },
    {
      category: "Payments & Finances",
      questions: [
        {
          q: "How do I record a payment?",
          a: "Open the job, go to the 'Payments' tab, and click 'Add Payment'. Enter the amount, date, and an optional description. All payments are totalled and shown against your expected budget."
        },
        {
          q: "Can I see profit/loss for each job?",
          a: "Yes! The Budget tab shows a visual breakdown of your budget vs costs. The Running Total tab gives you a detailed financial summary."
        },
        {
          q: "How are misc costs different from invoices?",
          a: "Misc costs are general expenses (fuel, parking, small materials) that reduce your profit. Invoices are formal bills from suppliers that you may need to pay or have already paid."
        }
      ]
    },
    {
      category: "Files & Documents",
      questions: [
        {
          q: "What file types can I upload?",
          a: "You can upload images (JPG, PNG) and PDF files. Maximum file size is 10MB per file."
        },
        {
          q: "Where are my files stored?",
          a: "Files are securely stored in the cloud and linked to each job or enquiry. They're only accessible to you and won't be shared."
        },
        {
          q: "Can I download uploaded files?",
          a: "Yes, click on any uploaded file to view or download it."
        }
      ]
    },
    {
      category: "Account & Security",
      questions: [
        {
          q: "How do I change my password?",
          a: "Go to the Sign In page and click 'Forgot Password'. Enter your email to receive a password reset link."
        },
        {
          q: "Is my data secure?",
          a: "Yes! All data is encrypted in transit and at rest. We use industry-standard security practices to protect your information."
        },
        {
          q: "Can multiple people access my account?",
          a: "Currently, each account is for individual use. Team features may be available in future updates."
        }
      ]
    }
  ];

  const filteredGuides = guides.filter(
    guide =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <BookOpen className="h-10 w-10 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Help Centre</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn how to get the most out of TradeMate with our comprehensive guides and FAQs
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search help articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: ClipboardList, label: "Jobs", href: "#jobs" },
          { icon: MessageSquare, label: "Enquiries", href: "#enquiries" },
          { icon: Calculator, label: "Budget", href: "#jobs" },
          { icon: HelpCircle, label: "FAQs", href: "#faqs" }
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <link.icon className="h-5 w-5 text-primary" />
            <span className="font-medium">{link.label}</span>
          </a>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="guides" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            User Guides
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQs
          </TabsTrigger>
        </TabsList>

        {/* Guides Tab */}
        <TabsContent value="guides" className="mt-6 space-y-6">
          {filteredGuides.map((guide) => (
            <Card key={guide.id} id={guide.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <guide.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{guide.title}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {guide.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Content sections */}
                {guide.content.map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-primary" />
                      {section.heading}
                    </h4>
                    <p className="text-muted-foreground whitespace-pre-line pl-6">
                      {section.text}
                    </p>
                  </div>
                ))}

                {/* Tips section */}
                {guide.tips && guide.tips.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-amber-600" />
                      <h4 className="font-semibold text-amber-800 dark:text-amber-300">Pro Tips</h4>
                    </div>
                    <ul className="space-y-1">
                      {guide.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-amber-700 dark:text-amber-400">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filteredGuides.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No guides found matching "{searchQuery}"</p>
            </div>
          )}
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" id="faqs" className="mt-6 space-y-6">
          {filteredFaqs.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge variant="secondary">{category.questions.length}</Badge>
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, idx) => (
                    <AccordionItem key={idx} value={`${category.category}-${idx}`}>
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-medium">{faq.q}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No FAQs found matching "{searchQuery}"</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Contact Support */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Still need help?</h3>
                <p className="text-muted-foreground">Our support team is here to assist you</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="mailto:support@trademate.app"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Contact Support
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
