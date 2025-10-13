import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, BookOpen, Zap, CheckCircle, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/app");
      }
    });
  }, [navigate]);

  const features = [
    {
      icon: FileText,
      title: "Multiple Format Support",
      description: "Upload DOCX, PDF, or TXT files and see them formatted professionally",
    },
    {
      icon: BookOpen,
      title: "4 Citation Styles",
      description: "Instant formatting in APA, MLA, Chicago, or Harvard styles",
    },
    {
      icon: Zap,
      title: "Real-time Preview",
      description: "See your formatted paper update as you add citations",
    },
  ];

  const benefits = [
    "Automatic citation formatting",
    "Bibliography generation",
    "Footnote management",
    "Professional document preview",
    "Save multiple papers",
    "Export to PDF & DOCX",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-academic-blueLight/10 to-secondary">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <FileText className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-primary">AcademicFormat</h1>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Format Your Research Papers <span className="text-primary">Professionally</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Stop worrying about citation formatting. Upload your paper, add sources, and instantly
            see it formatted to academic standards in APA, MLA, Chicago, or Harvard style.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2 text-lg px-8">
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            Everything You Need for Perfect Formatting
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="academic-shadow hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-12 px-8">
              <h3 className="text-3xl font-bold mb-8 text-center">
                Perfect for Students & Researchers
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/auth")}
                  className="gap-2 text-lg px-8"
                >
                  Start Formatting Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h3 className="text-3xl font-bold">How It Works</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                1
              </div>
              <h4 className="text-xl font-semibold">Upload Your Paper</h4>
              <p className="text-muted-foreground">
                Drop in your DOCX, PDF, or TXT file
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                2
              </div>
              <h4 className="text-xl font-semibold">Add Your Sources</h4>
              <p className="text-muted-foreground">
                Input citations and choose your style
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                3
              </div>
              <h4 className="text-xl font-semibold">Export Perfect Paper</h4>
              <p className="text-muted-foreground">
                Download formatted PDF or DOCX
              </p>
            </div>
          </div>

          <div className="pt-8">
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              Try It Free Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 AcademicFormat. Professional research paper formatting made simple.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
