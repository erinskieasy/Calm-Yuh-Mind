import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Video, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const articles = [
  {
    title: "Understanding Anxiety: A Comprehensive Guide",
    description: "Learn about anxiety disorders, their symptoms, and evidence-based coping strategies.",
    url: "#",
    source: "Mental Health Foundation",
  },
  {
    title: "Managing Depression: Daily Strategies That Work",
    description: "Practical tips for managing depression symptoms and improving daily functioning.",
    url: "#",
    source: "American Psychological Association",
  },
  {
    title: "The Science of Mindfulness and Mental Health",
    description: "Explore how mindfulness practices can improve mental well-being and reduce stress.",
    url: "#",
    source: "Harvard Medical School",
  },
  {
    title: "Building Resilience in Difficult Times",
    description: "Strategies for developing mental resilience and bouncing back from challenges.",
    url: "#",
    source: "Psychology Today",
  },
  {
    title: "Sleep and Mental Health: The Connection",
    description: "Understanding the vital relationship between quality sleep and emotional well-being.",
    url: "#",
    source: "National Sleep Foundation",
  },
  {
    title: "Recognizing Signs of Burnout",
    description: "Identify early warning signs of burnout and learn prevention strategies.",
    url: "#",
    source: "Mayo Clinic",
  },
];

const books = [
  {
    title: "The Anxiety and Phobia Workbook",
    author: "Edmund J. Bourne",
    description: "A comprehensive guide to understanding and overcoming anxiety disorders through practical exercises.",
    year: "2020",
  },
  {
    title: "Feeling Good: The New Mood Therapy",
    author: "David D. Burns",
    description: "Learn cognitive behavioral techniques to overcome depression and develop a positive outlook.",
    year: "1999",
  },
  {
    title: "The Body Keeps the Score",
    author: "Bessel van der Kolk",
    description: "Understanding how trauma affects the body and mind, with pathways to recovery.",
    year: "2014",
  },
  {
    title: "Mindfulness for Beginners",
    author: "Jon Kabat-Zinn",
    description: "An introduction to mindfulness meditation and its benefits for mental health.",
    year: "2016",
  },
  {
    title: "Lost Connections",
    author: "Johann Hari",
    description: "Exploring the real causes of depression and anxiety and unexpected solutions.",
    year: "2018",
  },
  {
    title: "The Gifts of Imperfection",
    author: "Brené Brown",
    description: "Let go of who you think you're supposed to be and embrace who you are.",
    year: "2010",
  },
];

const videos = [
  {
    title: "Understanding Mental Health",
    description: "A comprehensive overview of mental health, common disorders, and when to seek help.",
    duration: "12:45",
    platform: "TED-Ed",
  },
  {
    title: "Meditation for Anxiety and Stress",
    description: "Guided meditation practice specifically designed to reduce anxiety and calm the mind.",
    duration: "20:00",
    platform: "Headspace",
  },
  {
    title: "The Power of Vulnerability",
    description: "Brené Brown discusses the importance of vulnerability in human connection and mental health.",
    duration: "20:19",
    platform: "TED Talk",
  },
  {
    title: "Cognitive Behavioral Therapy Explained",
    description: "Learn the basics of CBT and how it helps treat depression and anxiety.",
    duration: "15:30",
    platform: "Psych Hub",
  },
  {
    title: "Building Better Mental Health",
    description: "Practical strategies for improving mental health and emotional well-being daily.",
    duration: "18:22",
    platform: "HealthyGamerGG",
  },
  {
    title: "Understanding Panic Attacks",
    description: "What happens during a panic attack and how to manage symptoms effectively.",
    duration: "10:15",
    platform: "Therapy in a Nutshell",
  },
];

export default function Resources() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-4xl font-display font-semibold text-foreground mb-2">
          Mental Health Resources
        </h1>
        <p className="text-muted-foreground text-lg">
          Explore curated articles, books, and videos to support your mental wellness journey
        </p>
      </div>

      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles" data-testid="tab-articles">
            <FileText className="w-4 h-4 mr-2" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="books" data-testid="tab-books">
            <BookOpen className="w-4 h-4 mr-2" />
            Books
          </TabsTrigger>
          <TabsTrigger value="videos" data-testid="tab-videos">
            <Video className="w-4 h-4 mr-2" />
            Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {articles.map((article, index) => (
              <Card key={index} className="hover-elevate">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
                      <CardDescription>{article.description}</CardDescription>
                    </div>
                    <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{article.source}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      data-testid={`button-article-${index}`}
                    >
                      Read More
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="books" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {books.map((book, index) => (
              <Card key={index} className="hover-elevate">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{book.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-2">
                        by {book.author} ({book.year})
                      </p>
                      <CardDescription>{book.description}</CardDescription>
                    </div>
                    <BookOpen className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    data-testid={`button-book-${index}`}
                  >
                    Find this Book
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {videos.map((video, index) => (
              <Card key={index} className="hover-elevate">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{video.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-2">
                        {video.platform} • {video.duration}
                      </p>
                      <CardDescription>{video.description}</CardDescription>
                    </div>
                    <Video className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    data-testid={`button-video-${index}`}
                  >
                    Watch Video
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-8 bg-muted/30">
        <CardHeader>
          <CardTitle>Crisis Resources</CardTitle>
          <CardDescription>
            If you're in crisis or need immediate support, please reach out to these resources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium">National Suicide Prevention Lifeline</p>
              <p className="text-sm text-muted-foreground">24/7 crisis support</p>
            </div>
            <p className="text-lg font-semibold">988</p>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium">Crisis Text Line</p>
              <p className="text-sm text-muted-foreground">Text support available 24/7</p>
            </div>
            <p className="text-lg font-semibold">Text HOME to 741741</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
