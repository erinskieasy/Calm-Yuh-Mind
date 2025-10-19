import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Video, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const articles = [
  {
    title: "Understanding Anxiety Disorders",
    description: "Comprehensive guide to anxiety disorders, their symptoms, and evidence-based treatments.",
    url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
    source: "National Institute of Mental Health",
  },
  {
    title: "Depression: What You Need to Know",
    description: "Learn about depression symptoms, causes, treatment options, and where to get help.",
    url: "https://www.nimh.nih.gov/health/topics/depression",
    source: "National Institute of Mental Health",
  },
  {
    title: "Mental Health Topics & Articles",
    description: "Evidence-based articles on anxiety, depression, stress, mindfulness, and emotional wellness.",
    url: "https://www.health.harvard.edu/topics/mental-health/all",
    source: "Harvard Health Publishing",
  },
  {
    title: "Mental Health Resources & Support",
    description: "Trusted information on mental health conditions, treatment options, and crisis resources.",
    url: "https://magazine.medlineplus.gov/topic/mental-health",
    source: "NIH MedlinePlus",
  },
  {
    title: "Building Emotional Resilience",
    description: "Strategies for developing mental resilience and bouncing back from life's challenges.",
    url: "https://www.apa.org/topics/resilience",
    source: "American Psychological Association",
  },
  {
    title: "Mental Health and Wellness",
    description: "Explore mental health conditions, coping strategies, and paths to emotional well-being.",
    url: "https://www.mayoclinic.org/diseases-conditions/mental-illness/symptoms-causes/syc-20374968",
    source: "Mayo Clinic",
  },
];

const books = [
  {
    title: "The Anxiety and Phobia Workbook",
    author: "Edmund J. Bourne",
    description: "A comprehensive guide to understanding and overcoming anxiety disorders through practical exercises.",
    year: "2020",
    url: "https://www.amazon.com/Anxiety-Phobia-Workbook-Edmund-Bourne/dp/1684034833",
  },
  {
    title: "Feeling Good: The New Mood Therapy",
    author: "David D. Burns",
    description: "Learn cognitive behavioral techniques to overcome depression and develop a positive outlook.",
    year: "1999",
    url: "https://www.amazon.com/Feeling-Good-New-Mood-Therapy/dp/0380810336",
  },
  {
    title: "The Body Keeps the Score",
    author: "Bessel van der Kolk",
    description: "Understanding how trauma affects the body and mind, with pathways to recovery.",
    year: "2014",
    url: "https://www.amazon.com/Body-Keeps-Score-Healing-Trauma/dp/0143127748",
  },
  {
    title: "Mindfulness for Beginners",
    author: "Jon Kabat-Zinn",
    description: "An introduction to mindfulness meditation and its benefits for mental health.",
    year: "2016",
    url: "https://www.amazon.com/Mindfulness-Beginners-Reclaiming-Present-Moment/dp/1622036670",
  },
  {
    title: "Lost Connections",
    author: "Johann Hari",
    description: "Exploring the real causes of depression and anxiety and unexpected solutions.",
    year: "2018",
    url: "https://www.amazon.com/Lost-Connections-Uncovering-Depression-Unexpected/dp/1632868318",
  },
  {
    title: "The Gifts of Imperfection",
    author: "Brené Brown",
    description: "Let go of who you think you're supposed to be and embrace who you are.",
    year: "2010",
    url: "https://www.amazon.com/Gifts-Imperfection-Think-Supposed-Embrace/dp/159285849X",
  },
];

const videos = [
  {
    title: "The Power of Vulnerability",
    description: "Brené Brown discusses the importance of vulnerability in human connection and mental health.",
    duration: "20:19",
    platform: "TED Talk",
    url: "https://www.youtube.com/watch?v=iCvmsMzlF7o",
  },
  {
    title: "Guided Meditation Videos",
    description: "Collection of guided meditations for anxiety, stress, sleep, and mindfulness practice.",
    duration: "Various",
    platform: "Headspace",
    url: "https://www.youtube.com/@headspace",
  },
  {
    title: "How to Deal with Anxiety",
    description: "Practical strategies and techniques for managing anxiety in everyday life.",
    duration: "8:44",
    platform: "Therapy in a Nutshell",
    url: "https://www.youtube.com/watch?v=WWloIAQpMcQ",
  },
  {
    title: "Understanding Depression",
    description: "What depression is, how it affects the brain, and evidence-based treatment approaches.",
    duration: "5:32",
    platform: "TED-Ed",
    url: "https://www.youtube.com/watch?v=z-IR48Mb3W0",
  },
  {
    title: "Mental Health for All by Involving All",
    description: "Dr. Vikram Patel's TEDx talk on making mental health care accessible to everyone.",
    duration: "17:43",
    platform: "TEDx",
    url: "https://www.youtube.com/watch?v=yzm4gpAKrBk",
  },
  {
    title: "The Skills for Healthy Romantic Relationships",
    description: "Understanding attachment styles and building healthy relationship patterns.",
    duration: "13:50",
    platform: "The School of Life",
    url: "https://www.youtube.com/watch?v=NhyfBi-Ad4c",
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
                      onClick={() => window.open(article.url, '_blank')}
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
                    onClick={() => window.open(book.url, '_blank')}
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
                    onClick={() => window.open(video.url, '_blank')}
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
