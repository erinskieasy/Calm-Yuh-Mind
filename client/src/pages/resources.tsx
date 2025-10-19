import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Video, FileText, ExternalLink, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface CrisisResource {
  country: string;
  hotline: {
    name: string;
    number: string;
    hours: string;
  };
  textLine: {
    name: string;
    number: string;
    hours: string;
  };
}

const crisisResources: CrisisResource[] = [
  {
    country: "Argentina",
    hotline: { name: "Centro de Asistencia al Suicida", number: "135", hours: "24/7" },
    textLine: { name: "Mental Health Line", number: "(011) 5275-1135", hours: "24/7" },
  },
  {
    country: "Australia",
    hotline: { name: "Lifeline Australia", number: "13 11 14", hours: "24/7" },
    textLine: { name: "Crisis Text Line", number: "Text 0477 13 11 14", hours: "24/7" },
  },
  {
    country: "Austria",
    hotline: { name: "Telefonseelsorge", number: "142", hours: "24/7" },
    textLine: { name: "Online Counseling", number: "Visit www.telefonseelsorge.at", hours: "24/7" },
  },
  {
    country: "Belgium",
    hotline: { name: "Centre de Prévention du Suicide", number: "0800 32 123", hours: "24/7" },
    textLine: { name: "Suicide Hotline", number: "1813", hours: "24/7" },
  },
  {
    country: "Brazil",
    hotline: { name: "CVV - Centro de Valorização da Vida", number: "188", hours: "24/7" },
    textLine: { name: "CVV Chat", number: "Visit www.cvv.org.br", hours: "24/7" },
  },
  {
    country: "Canada",
    hotline: { name: "Talk Suicide Canada", number: "1-833-456-4566", hours: "24/7" },
    textLine: { name: "Crisis Text Line", number: "Text HOME to 686868", hours: "24/7" },
  },
  {
    country: "Chile",
    hotline: { name: "Salud Responde", number: "600 360 7777", hours: "24/7" },
    textLine: { name: "Todo Mejora", number: "Text +56 9 9999 0000", hours: "24/7" },
  },
  {
    country: "China",
    hotline: { name: "Beijing Suicide Research and Prevention Center", number: "010-82951332", hours: "24/7" },
    textLine: { name: "Shanghai Mental Health Center", number: "021-64387250", hours: "8am-8pm" },
  },
  {
    country: "Colombia",
    hotline: { name: "Línea 106", number: "106", hours: "24/7" },
    textLine: { name: "Teléfono de la Esperanza", number: "(1) 323 24 25", hours: "24/7" },
  },
  {
    country: "Denmark",
    hotline: { name: "Livslinien", number: "70 201 201", hours: "24/7" },
    textLine: { name: "Børns Vilkår", number: "116 111", hours: "11am-11pm" },
  },
  {
    country: "Finland",
    hotline: { name: "Crisis Helpline", number: "09-2525-0111", hours: "24/7" },
    textLine: { name: "Finnish Association for Mental Health", number: "Visit mieli.fi/en", hours: "Mon-Fri 9am-3pm" },
  },
  {
    country: "France",
    hotline: { name: "SOS Amitié", number: "09 72 39 40 50", hours: "24/7" },
    textLine: { name: "Suicide Écoute", number: "01 45 39 40 00", hours: "24/7" },
  },
  {
    country: "Germany",
    hotline: { name: "Telefonseelsorge", number: "0800 111 0 111", hours: "24/7" },
    textLine: { name: "Nummer gegen Kummer", number: "116 123", hours: "24/7" },
  },
  {
    country: "Greece",
    hotline: { name: "Suicide Help Greece", number: "1018", hours: "24/7" },
    textLine: { name: "Klimaka NGO", number: "801 801 99 99", hours: "Mon-Fri 9am-9pm" },
  },
  {
    country: "Hong Kong",
    hotline: { name: "Samaritans Hong Kong", number: "2896 0000", hours: "24/7" },
    textLine: { name: "Open Up Hotline", number: "2382 0000", hours: "24/7" },
  },
  {
    country: "India",
    hotline: { name: "AASRA", number: "91-22-27546669", hours: "24/7" },
    textLine: { name: "Vandrevala Foundation", number: "1860 2662 345", hours: "24/7" },
  },
  {
    country: "Indonesia",
    hotline: { name: "Yayasan Pulih", number: "021-788-42580", hours: "Mon-Fri 10am-5pm" },
    textLine: { name: "Into The Light", number: "Visit intothelightid.org", hours: "24/7 online" },
  },
  {
    country: "Ireland",
    hotline: { name: "Samaritans Ireland", number: "116 123", hours: "24/7" },
    textLine: { name: "Pieta House", number: "1800 247 247", hours: "24/7" },
  },
  {
    country: "Israel",
    hotline: { name: "ERAN - Emotional First Aid", number: "1201", hours: "24/7" },
    textLine: { name: "SAHAR Emotional Support Chat", number: "Visit sahar.org.il", hours: "24/7" },
  },
  {
    country: "Italy",
    hotline: { name: "Telefono Amico", number: "02 2327 2327", hours: "24/7" },
    textLine: { name: "Samaritans Onlus", number: "800 86 00 22", hours: "1pm-10pm" },
  },
  {
    country: "Japan",
    hotline: { name: "TELL Lifeline", number: "03-5774-0992", hours: "9am-11pm daily" },
    textLine: { name: "Inochi no Denwa", number: "0570-783-556", hours: "24/7" },
  },
  {
    country: "Kenya",
    hotline: { name: "Kenya Red Cross", number: "1199", hours: "24/7" },
    textLine: { name: "Befrienders Kenya", number: "Visit befrienderskenya.org", hours: "24/7 online" },
  },
  {
    country: "Malaysia",
    hotline: { name: "Befrienders KL", number: "03-7627 2929", hours: "24/7" },
    textLine: { name: "Talian Kasih", number: "15999", hours: "24/7" },
  },
  {
    country: "Mexico",
    hotline: { name: "Consejo Ciudadano", number: "55 5533 5533", hours: "24/7" },
    textLine: { name: "SAPTEL", number: "55 5259 8121", hours: "24/7" },
  },
  {
    country: "Netherlands",
    hotline: { name: "113 Suicide Prevention", number: "0800-0113", hours: "24/7" },
    textLine: { name: "Korrelatie", number: "0900-1450", hours: "24/7" },
  },
  {
    country: "New Zealand",
    hotline: { name: "Lifeline Aotearoa", number: "0800 543 354", hours: "24/7" },
    textLine: { name: "1737 Text Support", number: "Text 1737", hours: "24/7" },
  },
  {
    country: "Norway",
    hotline: { name: "Kirkens SOS", number: "22 40 00 40", hours: "24/7" },
    textLine: { name: "Mental Helse", number: "116 123", hours: "Mon-Sun 6pm-midnight" },
  },
  {
    country: "Philippines",
    hotline: { name: "NCMH Crisis Hotline", number: "(02) 7-989-8727", hours: "24/7" },
    textLine: { name: "In Touch Community Services", number: "0917 800 1123", hours: "24/7" },
  },
  {
    country: "Poland",
    hotline: { name: "Telefon Zaufania", number: "116 123", hours: "24/7" },
    textLine: { name: "Linia Wsparcia Emocjonalnego", number: "22 484 88 84", hours: "Mon-Fri 2pm-10pm" },
  },
  {
    country: "Portugal",
    hotline: { name: "SOS Voz Amiga", number: "21 354 45 45", hours: "4pm-midnight daily" },
    textLine: { name: "Telefone da Amizade", number: "22 832 35 35", hours: "4pm-midnight daily" },
  },
  {
    country: "Russia",
    hotline: { name: "Samaritans Russia", number: "007 (495) 625-3101", hours: "24/7" },
    textLine: { name: "Psychological Help", number: "8-800-2000-122", hours: "24/7" },
  },
  {
    country: "Singapore",
    hotline: { name: "Samaritans of Singapore", number: "1-767", hours: "24/7" },
    textLine: { name: "Institute of Mental Health", number: "6389 2222", hours: "24/7" },
  },
  {
    country: "South Africa",
    hotline: { name: "SADAG", number: "0800 567 567", hours: "8am-8pm daily" },
    textLine: { name: "Lifeline South Africa", number: "0861 322 322", hours: "24/7" },
  },
  {
    country: "South Korea",
    hotline: { name: "Korea Suicide Prevention Center", number: "1393", hours: "24/7" },
    textLine: { name: "Mental Health Counseling", number: "1577-0199", hours: "24/7" },
  },
  {
    country: "Spain",
    hotline: { name: "Teléfono de la Esperanza", number: "717 003 717", hours: "24/7" },
    textLine: { name: "Fundación ANAR", number: "900 20 20 10", hours: "24/7" },
  },
  {
    country: "Sweden",
    hotline: { name: "Mind - Självmordslinjen", number: "90101", hours: "24/7" },
    textLine: { name: "Jourhavande Präst", number: "112", hours: "24/7" },
  },
  {
    country: "Switzerland",
    hotline: { name: "Die Dargebotene Hand", number: "143", hours: "24/7" },
    textLine: { name: "Pro Juventute", number: "147", hours: "24/7" },
  },
  {
    country: "Taiwan",
    hotline: { name: "Lifeline Taiwan", number: "1995", hours: "24/7" },
    textLine: { name: "Taiwan Suicide Prevention Center", number: "0800-788-995", hours: "24/7" },
  },
  {
    country: "Thailand",
    hotline: { name: "Department of Mental Health", number: "1323", hours: "24/7" },
    textLine: { name: "Samaritans of Thailand", number: "(02) 713-6793", hours: "Daily 10am-10pm" },
  },
  {
    country: "Turkey",
    hotline: { name: "Yaşam Destek Hattı", number: "182", hours: "24/7" },
    textLine: { name: "Mental Health Hotline", number: "444 63 66", hours: "24/7" },
  },
  {
    country: "United Arab Emirates",
    hotline: { name: "Dubai Community Health Centre", number: "04-344-7777", hours: "24/7" },
    textLine: { name: "Priory Wellbeing Centre", number: "800-4673", hours: "Sun-Thu 8am-8pm" },
  },
  {
    country: "United Kingdom",
    hotline: { name: "Samaritans UK", number: "116 123", hours: "24/7" },
    textLine: { name: "Shout Crisis Text Line", number: "Text SHOUT to 85258", hours: "24/7" },
  },
  {
    country: "United States",
    hotline: { name: "National Suicide Prevention Lifeline", number: "988", hours: "24/7" },
    textLine: { name: "Crisis Text Line", number: "Text HOME to 741741", hours: "24/7" },
  },
  {
    country: "Uruguay",
    hotline: { name: "Apoyo Emocional", number: "*8483", hours: "24/7" },
    textLine: { name: "Línea de Vida", number: "0800 0767", hours: "24/7" },
  },
  {
    country: "Venezuela",
    hotline: { name: "SADEC", number: "0241-8433308", hours: "Mon-Fri 8am-5pm" },
    textLine: { name: "Emergency Services", number: "171", hours: "24/7" },
  },
];

export default function Resources() {
  const [selectedCountry, setSelectedCountry] = useState("United States");

  const currentCrisis = crisisResources.find((r) => r.country === selectedCountry);

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

      <Card className="mt-8 bg-destructive/5 border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Crisis Resources</CardTitle>
          <CardDescription>
            If you're in crisis or need immediate support, please reach out to these resources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Your Country</label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full" data-testid="select-country">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {crisisResources.map((resource) => (
                  <SelectItem key={resource.country} value={resource.country}>
                    {resource.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentCrisis && (
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-lg border border-destructive/20 bg-background">
                <Phone className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground mb-1">
                    {currentCrisis.hotline.name}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {currentCrisis.hotline.hours}
                  </p>
                  <p className="text-lg font-bold text-destructive">
                    {currentCrisis.hotline.number}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg border border-destructive/20 bg-background">
                <MessageSquare className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground mb-1">
                    {currentCrisis.textLine.name}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {currentCrisis.textLine.hours}
                  </p>
                  <p className="text-lg font-bold text-destructive">
                    {currentCrisis.textLine.number}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-destructive/10">
            <p className="text-sm text-muted-foreground italic">
              If you are experiencing a life-threatening emergency, please call your local emergency services (911, 999, 112, etc.) immediately.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
