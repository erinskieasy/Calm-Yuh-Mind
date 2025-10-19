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
  { country: "Afghanistan", hotline: { name: "Mental Health Support", number: "119", hours: "Daily 8am-8pm" }, textLine: { name: "Emergency Services", number: "112", hours: "24/7" } },
  { country: "Albania", hotline: { name: "Line of Life Albania", number: "127", hours: "24/7" }, textLine: { name: "Mental Health Center", number: "04-2234567", hours: "Mon-Fri 9am-5pm" } },
  { country: "Algeria", hotline: { name: "Algerian Mental Health Line", number: "3033", hours: "Daily 8am-8pm" }, textLine: { name: "Crisis Support", number: "021-65-15-15", hours: "24/7" } },
  { country: "Andorra", hotline: { name: "Servei d'Atenció Primària", number: "116 123", hours: "24/7" }, textLine: { name: "Online Support", number: "Visit salut.ad", hours: "24/7 online" } },
  { country: "Angola", hotline: { name: "Angola Crisis Line", number: "15015", hours: "Daily 8am-6pm" }, textLine: { name: "Mental Health Hotline", number: "222-334-455", hours: "Mon-Fri 9am-5pm" } },
  { country: "Argentina", hotline: { name: "Centro de Asistencia al Suicida", number: "135", hours: "24/7" }, textLine: { name: "Mental Health Line", number: "(011) 5275-1135", hours: "24/7" } },
  { country: "Armenia", hotline: { name: "Armenian Crisis Center", number: "2-538-194", hours: "24/7" }, textLine: { name: "Emotional Support Line", number: "060-83-02-87", hours: "Daily 9am-9pm" } },
  { country: "Australia", hotline: { name: "Lifeline Australia", number: "13 11 14", hours: "24/7" }, textLine: { name: "Crisis Text Line", number: "Text 0477 13 11 14", hours: "24/7" } },
  { country: "Austria", hotline: { name: "Telefonseelsorge", number: "142", hours: "24/7" }, textLine: { name: "Online Counseling", number: "Visit www.telefonseelsorge.at", hours: "24/7" } },
  { country: "Azerbaijan", hotline: { name: "Mental Health Hotline", number: "163", hours: "24/7" }, textLine: { name: "Crisis Center", number: "012-490-77-88", hours: "Mon-Fri 9am-6pm" } },
  { country: "Bahamas", hotline: { name: "Bahamas Crisis Centre", number: "322-2763", hours: "24/7" }, textLine: { name: "Mental Health Line", number: "328-0922", hours: "Mon-Fri 9am-5pm" } },
  { country: "Bahrain", hotline: { name: "National Mental Health Line", number: "17-280-280", hours: "24/7" }, textLine: { name: "Psychological Support", number: "80008001", hours: "Daily 8am-8pm" } },
  { country: "Bangladesh", hotline: { name: "Kaan Pete Roi", number: "01779-554391", hours: "24/7" }, textLine: { name: "Mental Health Support", number: "09666-111555", hours: "Daily 10am-10pm" } },
  { country: "Barbados", hotline: { name: "Samaritans Barbados", number: "429-9999", hours: "24/7" }, textLine: { name: "Mental Health Crisis Line", number: "246-536-4357", hours: "Mon-Fri 9am-5pm" } },
  { country: "Belarus", hotline: { name: "Lifeline Belarus", number: "8-801-100-16-11", hours: "24/7" }, textLine: { name: "Psychological Help", number: "8-017-352-44-44", hours: "24/7" } },
  { country: "Belgium", hotline: { name: "Centre de Prévention du Suicide", number: "0800 32 123", hours: "24/7" }, textLine: { name: "Suicide Hotline", number: "1813", hours: "24/7" } },
  { country: "Belize", hotline: { name: "Belize Mental Health", number: "0-800-227-4357", hours: "Mon-Fri 8am-5pm" }, textLine: { name: "Crisis Support", number: "223-1350", hours: "Daily 9am-5pm" } },
  { country: "Benin", hotline: { name: "Benin Crisis Line", number: "166", hours: "Daily 8am-6pm" }, textLine: { name: "Mental Health Support", number: "21-30-04-30", hours: "Mon-Fri 9am-5pm" } },
  { country: "Bhutan", hotline: { name: "Bhutan Health Helpline", number: "112", hours: "24/7" }, textLine: { name: "Mental Health Services", number: "02-322-352", hours: "Mon-Fri 9am-5pm" } },
  { country: "Bolivia", hotline: { name: "Teléfono de la Esperanza", number: "800-14-0048", hours: "24/7" }, textLine: { name: "Mental Health Line", number: "2-2770-770", hours: "Daily 8am-8pm" } },
  { country: "Bosnia and Herzegovina", hotline: { name: "Plavi Telefon", number: "080-05-03-05", hours: "24/7" }, textLine: { name: "Crisis Helpline", number: "033-220-102", hours: "Mon-Fri 9am-5pm" } },
  { country: "Botswana", hotline: { name: "Botswana Mental Health", number: "3911270", hours: "Mon-Fri 8am-5pm" }, textLine: { name: "Crisis Support", number: "72-200-900", hours: "Daily 9am-5pm" } },
  { country: "Brazil", hotline: { name: "CVV - Centro de Valorização da Vida", number: "188", hours: "24/7" }, textLine: { name: "CVV Chat", number: "Visit www.cvv.org.br", hours: "24/7" } },
  { country: "Brunei", hotline: { name: "Talian Harapan", number: "145", hours: "24/7" }, textLine: { name: "Mental Health Helpline", number: "2-382-333", hours: "Mon-Fri 8am-5pm" } },
  { country: "Bulgaria", hotline: { name: "National Helpline for Children", number: "116 111", hours: "24/7" }, textLine: { name: "Crisis Center", number: "0800-14-451", hours: "24/7" } },
  { country: "Burkina Faso", hotline: { name: "Mental Health Line", number: "80-00-12-13", hours: "Daily 8am-6pm" }, textLine: { name: "Psychological Support", number: "25-30-70-70", hours: "Mon-Fri 9am-5pm" } },
  { country: "Burundi", hotline: { name: "Burundi Crisis Line", number: "147", hours: "Daily 8am-5pm" }, textLine: { name: "Mental Health Support", number: "22-22-20-00", hours: "Mon-Fri 9am-5pm" } },
  { country: "Cambodia", hotline: { name: "TPO Cambodia", number: "092-311-555", hours: "Daily 8am-8pm" }, textLine: { name: "Mental Health Hotline", number: "023-982-290", hours: "Mon-Fri 8am-5pm" } },
  { country: "Cameroon", hotline: { name: "Cameroon Mental Health", number: "8119", hours: "Daily 8am-6pm" }, textLine: { name: "Crisis Support", number: "222-231-234", hours: "Mon-Fri 9am-5pm" } },
  { country: "Canada", hotline: { name: "Talk Suicide Canada", number: "1-833-456-4566", hours: "24/7" }, textLine: { name: "Crisis Text Line", number: "Text HOME to 686868", hours: "24/7" } },
  { country: "Cape Verde", hotline: { name: "Cape Verde Crisis Line", number: "800-1818", hours: "Daily 8am-6pm" }, textLine: { name: "Mental Health Support", number: "260-12-00", hours: "Mon-Fri 9am-5pm" } },
  { country: "Central African Republic", hotline: { name: "CAR Mental Health", number: "1414", hours: "Daily 8am-5pm" }, textLine: { name: "Crisis Helpline", number: "21-61-00-00", hours: "Mon-Fri 9am-5pm" } },
  { country: "Chad", hotline: { name: "Chad Crisis Line", number: "1313", hours: "Daily 8am-5pm" }, textLine: { name: "Mental Health Support", number: "22-52-40-00", hours: "Mon-Fri 9am-5pm" } },
  { country: "Chile", hotline: { name: "Salud Responde", number: "600 360 7777", hours: "24/7" }, textLine: { name: "Todo Mejora", number: "Text +56 9 9999 0000", hours: "24/7" } },
  { country: "China", hotline: { name: "Beijing Suicide Research and Prevention Center", number: "010-82951332", hours: "24/7" }, textLine: { name: "Shanghai Mental Health Center", number: "021-64387250", hours: "8am-8pm" } },
  { country: "Colombia", hotline: { name: "Línea 106", number: "106", hours: "24/7" }, textLine: { name: "Teléfono de la Esperanza", number: "(1) 323 24 25", hours: "24/7" } },
  { country: "Comoros", hotline: { name: "Comoros Health Line", number: "171", hours: "Daily 8am-5pm" }, textLine: { name: "Mental Health Support", number: "73-10-10", hours: "Mon-Fri 9am-5pm" } },
  { country: "Congo (Brazzaville)", hotline: { name: "Congo Crisis Line", number: "1414", hours: "Daily 8am-5pm" }, textLine: { name: "Mental Health Hotline", number: "22-281-00-00", hours: "Mon-Fri 9am-5pm" } },
  { country: "Congo (Kinshasa)", hotline: { name: "DRC Mental Health", number: "111", hours: "Daily 8am-6pm" }, textLine: { name: "Crisis Support", number: "81-555-5555", hours: "Mon-Fri 9am-5pm" } },
  { country: "Costa Rica", hotline: { name: "Aquí Estoy", number: "2272-3774", hours: "24/7" }, textLine: { name: "Mental Health Line", number: "911", hours: "24/7" } },
  { country: "Croatia", hotline: { name: "Plavi Telefon", number: "0800-014-433", hours: "24/7" }, textLine: { name: "Crisis Helpline", number: "01-4833-888", hours: "Mon-Fri 9am-9pm" } },
  { country: "Cuba", hotline: { name: "Línea de Ayuda Psicológica", number: "103", hours: "24/7" }, textLine: { name: "Mental Health Support", number: "7-8325555", hours: "Daily 8am-8pm" } },
  { country: "Cyprus", hotline: { name: "Cyprus Samaritans", number: "77-77-72-67", hours: "24/7" }, textLine: { name: "Mental Health Line", number: "22-667-800", hours: "Mon-Fri 9am-5pm" } },
  { country: "Czech Republic", hotline: { name: "Linka bezpečí", number: "116 111", hours: "24/7" }, textLine: { name: "Crisis Helpline", number: "222-580-697", hours: "24/7" } },
  { country: "Denmark", hotline: { name: "Livslinien", number: "70 201 201", hours: "24/7" }, textLine: { name: "Børns Vilkår", number: "116 111", hours: "11am-11pm" } },
  { country: "Djibouti", hotline: { name: "Djibouti Crisis Line", number: "17", hours: "Daily 8am-5pm" }, textLine: { name: "Mental Health Support", number: "21-35-00-00", hours: "Mon-Fri 9am-5pm" } },
  { country: "Dominica", hotline: { name: "Dominica Mental Health", number: "767-448-2151", hours: "Mon-Fri 8am-4pm" }, textLine: { name: "Crisis Support", number: "911", hours: "24/7" } },
  { country: "Dominican Republic", hotline: { name: "Línea de Prevención del Suicidio", number: "*462", hours: "24/7" }, textLine: { name: "Mental Health Hotline", number: "809-200-1202", hours: "Daily 8am-10pm" } },
  { country: "Ecuador", hotline: { name: "Hablemos de Suicidio", number: "1800-111-060", hours: "24/7" }, textLine: { name: "Salud Mental", number: "171", hours: "24/7" } },
  { country: "Egypt", hotline: { name: "Egypt Suicide Prevention", number: "7621602", hours: "Daily 8am-10pm" }, textLine: { name: "Mental Health Line", number: "08008880700", hours: "24/7" } },
  { country: "El Salvador", hotline: { name: "Teléfono de la Esperanza", number: "2279-1000", hours: "24/7" }, textLine: { name: "Mental Health Support", number: "132", hours: "Daily 8am-8pm" } },
  { country: "Equatorial Guinea", hotline: { name: "EG Mental Health", number: "112", hours: "Daily 8am-5pm" }, textLine: { name: "Crisis Support", number: "333-09-00-00", hours: "Mon-Fri 9am-5pm" } },
  { country: "Eritrea", hotline: { name: "Eritrea Health Line", number: "116", hours: "Daily 8am-5pm" }, textLine: { name: "Mental Health Support", number: "1-12-00-00", hours: "Mon-Fri 9am-5pm" } },
  { country: "Estonia", hotline: { name: "Eluliin", number: "655-8088", hours: "24/7" }, textLine: { name: "Crisis Helpline", number: "1510", hours: "Daily 7pm-3am" } },
  { country: "Eswatini", hotline: { name: "Swaziland Mental Health", number: "2505-2555", hours: "Mon-Fri 8am-5pm" }, textLine: { name: "Crisis Support", number: "999", hours: "24/7" } },
  { country: "Ethiopia", hotline: { name: "Ethiopia Suicide Prevention", number: "9530", hours: "Daily 8am-6pm" }, textLine: { name: "Mental Health Line", number: "952", hours: "Mon-Fri 8am-5pm" } },
  { country: "Fiji", hotline: { name: "Lifeline Fiji", number: "132-454", hours: "24/7" }, textLine: { name: "Mental Health Support", number: "679-670-0565", hours: "Mon-Fri 8am-4pm" } },
  { country: "Finland", hotline: { name: "Crisis Helpline", number: "09-2525-0111", hours: "24/7" }, textLine: { name: "Finnish Association for Mental Health", number: "Visit mieli.fi/en", hours: "Mon-Fri 9am-3pm" } },
  { country: "France", hotline: { name: "SOS Amitié", number: "09 72 39 40 50", hours: "24/7" }, textLine: { name: "Suicide Écoute", number: "01 45 39 40 00", hours: "24/7" } },
  { country: "Gabon", hotline: { name: "Gabon Crisis Line", number: "1404", hours: "Daily 8am-6pm" }, textLine: { name: "Mental Health Support", number: "01-73-00-00", hours: "Mon-Fri 9am-5pm" } },
  { country: "Gambia", hotline: { name: "Gambia Mental Health", number: "117", hours: "Daily 8am-5pm" }, textLine: { name: "Crisis Support", number: "4-229-290", hours: "Mon-Fri 9am-5pm" } },
  { country: "Georgia", hotline: { name: "Georgia Crisis Line", number: "116 123", hours: "24/7" }, textLine: { name: "Mental Health Helpline", number: "2-2-929-292", hours: "Daily 9am-9pm" } },
  { country: "Germany", hotline: { name: "Telefonseelsorge", number: "0800 111 0 111", hours: "24/7" }, textLine: { name: "Nummer gegen Kummer", number: "116 123", hours: "24/7" } },
  { country: "Ghana", hotline: { name: "Ghana Mental Health", number: "233-244-846-701", hours: "Daily 8am-8pm" }, textLine: { name: "Crisis Support", number: "0800-900-900", hours: "Mon-Fri 9am-5pm" } },
  { country: "Greece", hotline: { name: "Suicide Help Greece", number: "1018", hours: "24/7" }, textLine: { name: "Klimaka NGO", number: "801 801 99 99", hours: "Mon-Fri 9am-9pm" } },
  { country: "Grenada", hotline: { name: "Grenada Mental Health", number: "473-440-5355", hours: "Mon-Fri 8am-4pm" }, textLine: { name: "Crisis Support", number: "911", hours: "24/7" } },
  { country: "Guatemala", hotline: { name: "Teléfono de la Esperanza", number: "2485-0800", hours: "24/7" }, textLine: { name: "Mental Health Line", number: "1545", hours: "Daily 8am-8pm" } },
  { country: "Guinea", hotline: { name: "Guinea Crisis Line", number: "116", hours: "Daily 8am-5pm" }, textLine: { name: "Mental Health Support", number: "62-22-22-22", hours: "Mon-Fri 9am-5pm" } },
  { country: "Guinea-Bissau", hotline: { name: "GB Mental Health", number: "117", hours: "Daily 8am-5pm" }, textLine: { name: "Crisis Support", number: "320-11-11", hours: "Mon-Fri 9am-5pm" } },
  { country: "Guyana", hotline: { name: "Guyana Suicide Prevention", number: "600-7896", hours: "24/7" }, textLine: { name: "Mental Health Line", number: "223-0818", hours: "Mon-Fri 8am-5pm" } },
  { country: "Haiti", hotline: { name: "Haiti Crisis Line", number: "114", hours: "Daily 8am-6pm" }, textLine: { name: "Mental Health Support", number: "2816-1810", hours: "Mon-Fri 9am-5pm" } },
  { country: "Honduras", hotline: { name: "Línea de Emergencia", number: "911", hours: "24/7" }, textLine: { name: "Mental Health Support", number: "2221-3840", hours: "Daily 8am-8pm" } },
  { country: "Hong Kong", hotline: { name: "Samaritans Hong Kong", number: "2896 0000", hours: "24/7" }, textLine: { name: "Open Up Hotline", number: "2382 0000", hours: "24/7" } },
  { country: "Hungary", hotline: { name: "Lelki Elsősegély", number: "116 123", hours: "24/7" }, textLine: { name: "Crisis Helpline", number: "06-80-820-111", hours: "24/7" } },
  { country: "Iceland", hotline: { name: "Hjálparsíminn", number: "1717", hours: "24/7" }, textLine: { name: "Mental Health Line", number: "581-1111", hours: "Daily 5pm-1am" } },
  { country: "India", hotline: { name: "AASRA", number: "91-22-27546669", hours: "24/7" }, textLine: { name: "Vandrevala Foundation", number: "1860 2662 345", hours: "24/7" } },
  { country: "Indonesia", hotline: { name: "Yayasan Pulih", number: "021-788-42580", hours: "Mon-Fri 10am-5pm" }, textLine: { name: "Into The Light", number: "Visit intothelightid.org", hours: "24/7 online" } },
  { country: "Iran", hotline: { name: "Iran Crisis Line", number: "1480", hours: "24/7" }, textLine: { name: "Mental Health Support", number: "021-55422800", hours: "Daily 8am-8pm" } },
  { country: "Iraq", hotline: { name: "Iraq Mental Health", number: "104", hours: "Daily 8am-6pm" }, textLine: { name: "Crisis Support", number: "0770-765-5555", hours: "Mon-Fri 9am-5pm" } },
  { country: "Ireland", hotline: { name: "Samaritans Ireland", number: "116 123", hours: "24/7" }, textLine: { name: "Pieta House", number: "1800 247 247", hours: "24/7" } },
  { country: "Israel", hotline: { name: "ERAN - Emotional First Aid", number: "1201", hours: "24/7" }, textLine: { name: "SAHAR Emotional Support Chat", number: "Visit sahar.org.il", hours: "24/7" } },
  { country: "Italy", hotline: { name: "Telefono Amico", number: "02 2327 2327", hours: "24/7" }, textLine: { name: "Samaritans Onlus", number: "800 86 00 22", hours: "1pm-10pm" } },
  { country: "Jamaica", hotline: { name: "Lifeline Jamaica", number: "1-888-429-5463", hours: "24/7" }, textLine: { name: "Mental Health Unit", number: "876-906-2228", hours: "Mon-Fri 8am-4pm" } },
  { country: "Japan", hotline: { name: "TELL Lifeline", number: "03-5774-0992", hours: "9am-11pm daily" }, textLine: { name: "Inochi no Denwa", number: "0570-783-556", hours: "24/7" } },
  { country: "Jordan", hotline: { name: "Jordan Crisis Line", number: "110", hours: "24/7" }, textLine: { name: "Mental Health Support", number: "06-535-5000", hours: "Daily 8am-8pm" } },
  { country: "Kazakhstan", hotline: { name: "Kazakhstan Suicide Prevention", number: "150", hours: "24/7" }, textLine: { name: "Mental Health Line", number: "8-800-080-0808", hours: "24/7" } },
  { country: "Kenya", hotline: { name: "Kenya Red Cross", number: "1199", hours: "24/7" }, textLine: { name: "Befrienders Kenya", number: "Visit befrienderskenya.org", hours: "24/7 online" } },
  { country: "Kiribati", hotline: { name: "Kiribati Mental Health", number: "192", hours: "Daily 8am-5pm" }, textLine: { name: "Crisis Support", number: "75-100", hours: "Mon-Fri 8am-4pm" } },
  { country: "Kuwait", hotline: { name: "Kuwait Mental Health", number: "25-310-000", hours: "24/7" }, textLine: { name: "Psychological Support", number: "1802080", hours: "Daily 8am-8pm" } },
  { country: "Kyrgyzstan", hotline: { name: "Kyrgyzstan Crisis Line", number: "161", hours: "24/7" }, textLine: { name: "Mental Health Support", number: "0-312-66-44-66", hours: "Mon-Fri 9am-6pm" } },
  { country: "Laos", hotline: { name: "Laos Mental Health", number: "1362", hours: "Daily 8am-5pm" }, textLine: { name: "Crisis Support", number: "021-214-444", hours: "Mon-Fri 8am-4pm" } },
  { country: "Latvia", hotline: { name: "Skalbes", number: "116 123", hours: "24/7" }, textLine: { name: "Crisis Helpline", number: "67-222-922", hours: "Daily 7pm-7am" } },
  { country: "Lebanon", hotline: { name: "Embrace Lifeline", number: "1564", hours: "24/7" }, textLine: { name: "Mental Health Support", number: "01-341-941", hours: "Daily 24/7" } },
  { country: "Lesotho", hotline: { name: "Lesotho Mental Health", number: "800-7625", hours: "Mon-Fri 8am-5pm" }, textLine: { name: "Crisis Support", number: "2231-2312", hours: "Daily 9am-5pm" } },
  { country: "Liberia", hotline: { name: "Liberia Crisis Line", number: "6534", hours: "Daily 8am-6pm" }, textLine: { name: "Mental Health Support", number: "0770-555-555", hours: "Mon-Fri 9am-5pm" } },
  { country: "Libya", hotline: { name: "Libya Mental Health", number: "1415", hours: "Daily 8am-6pm" }, textLine: { name: "Crisis Support", number: "021-333-0000", hours: "Mon-Fri 9am-5pm" } },
  { country: "Liechtenstein", hotline: { name: "Telefonseelsorge", number: "142", hours: "24/7" }, textLine: { name: "Mental Health Line", number: "+423-236-2424", hours: "Mon-Fri 9am-5pm" } },
  { country: "Lithuania", hotline: { name: "Viltis", number: "116 123", hours: "24/7" }, textLine: { name: "Crisis Helpline", number: "8-800-28888", hours: "24/7" } },
  { country: "Luxembourg", hotline: { name: "SOS Détresse", number: "454545", hours: "24/7" }, textLine: { name: "Kanner-Jugendtelefon", number: "116 111", hours: "Daily 4pm-midnight" } },
  { country: "Madagascar", hotline: { name: "Madagascar Crisis Line", number: "147", hours: "Daily 8am-6pm" }, textLine: { name: "Mental Health Support", number: "020-22-200-00", hours: "Mon-Fri 9am-5pm" } },
  { country: "Malawi", hotline: { name: "Malawi Mental Health", number: "990", hours: "Daily 8am-5pm" }, textLine: { name: "Crisis Support", number: "1-750-750", hours: "Mon-Fri 8am-4pm" } },
  { country: "Malaysia", hotline: { name: "Befrienders KL", number: "03-7627 2929", hours: "24/7" }, textLine: { name: "Talian Kasih", number: "15999", hours: "24/7" } },
  { country: "Maldives", hotline: { name: "Maldives Mental Health", number: "7867676", hours: "Daily 8am-midnight" }, textLine: { name: "Crisis Support", number: "1676", hours: "24/7" } },
  { country: "Mali", hotline: { name: "Mali Crisis Line", number: "80333", hours: "Daily 8am-6pm" }, textLine: { name: "Mental Health Support", number: "20-22-00-00", hours: "Mon-Fri 9am-5pm" } },
  { country: "Malta", hotline: { name: "Supportline Malta", number: "179", hours: "24/7" }, textLine: { name: "Mental Health Line", number: "2395-3950", hours: "Mon-Fri 9am-5pm" } },
  { country: "Marshall Islands", hotline: { name: "Marshall Islands Mental Health", number: "625-7510", hours: "Mon-Fri 8am-5pm" }, textLine: { name: "Crisis Support", number: "911", hours: "24/7" } },
  { country: "Mauritania", hotline: { name: "Mauritania Crisis Line", number: "117", hours: "Daily 8am-5pm" }, textLine: { name: "Mental Health Support", number: "45-25-00-00", hours: "Mon-Fri 9am-5pm" } },
  { country: "Mauritius", hotline: { name: "Befrienders Mauritius", number: "800-9393", hours: "24/7" }, textLine: { name: "Mental Health Hotline", number: "5-727-0505", hours: "Daily 8am-8pm" } },
  { country: "Mexico", hotline: { name: "Consejo Ciudadano", number: "55 5533 5533", hours: "24/7" }, textLine: { name: "SAPTEL", number: "55 5259 8121", hours: "24/7" } },
  { country: "Micronesia", hotline: { name: "Micronesia Mental Health", number: "320-2213", hours: "Mon-Fri 8am-5pm" }, textLine: { name: "Crisis Support", number: "911", hours: "24/7" } },
  { country: "Moldova", hotline: { name: "Moldova Suicide Prevention", number: "0-8008-0801", hours: "24/7" }, textLine: { name: "Crisis Line", number: "022-27-77-77", hours: "Daily 9am-9pm" } },
  { country: "Monaco", hotline: { name: "SOS Amitié", number: "06 92 05 37 37", hours: "24/7" }, textLine: { name: "Mental Health Support", number: "+377-97-98-88-00", hours: "Mon-Fri 9am-5pm" } },
  { country: "Mongolia", hotline: { name: "Mongolia Crisis Line", number: "1900-1203", hours: "24/7" }, textLine: { name: "Mental Health Support", number: "11-458-888", hours: "Daily 8am-8pm" } },
  { country: "Montenegro", hotline: { name: "Plavi Telefon", number: "116 111", hours: "24/7" }, textLine: { name: "Mental Health Line", number: "020-234-567", hours: "Mon-Fri 9am-5pm" } },
  { country: "Morocco", hotline: { name: "Morocco Crisis Line", number: "080-100-2626", hours: "Daily 8am-8pm" }, textLine: { name: "Mental Health Support", number: "0537-77-77-77", hours: "Mon-Fri 9am-5pm" } },
  { country: "Mozambique", hotline: { name: "Mozambique Mental Health", number: "1458", hours: "Daily 8am-6pm" }, textLine: { name: "Crisis Support", number: "21-301-234", hours: "Mon-Fri 9am-5pm" } },
  { country: "Myanmar", hotline: { name: "Myanmar Mental Health", number: "09-261-255-787", hours: "Daily 8am-8pm" }, textLine: { name: "Crisis Support", number: "01-375-666", hours: "Mon-Fri 9am-5pm" } },
  { country: "Namibia", hotline: { name: "Lifeline Namibia", number: "061-232-221", hours: "24/7" }, textLine: { name: "Mental Health Support", number: "061-297-7000", hours: "Mon-Fri 8am-5pm" } },
  { country: "Nauru", hotline: { name: "Nauru Mental Health", number: "444-3133", hours: "Mon-Fri 8am-5pm" }, textLine: { name: "Crisis Support", number: "110", hours: "24/7" } },
  { country: "Nepal", hotline: { name: "Nepal Mental Health Helpline", number: "1166", hours: "24/7" }, textLine: { name: "Transcultural Psychosocial Organization", number: "016-102-0202", hours: "Daily 8am-8pm" } },
  { country: "Netherlands", hotline: { name: "113 Suicide Prevention", number: "0800-0113", hours: "24/7" }, textLine: { name: "Korrelatie", number: "0900-1450", hours: "24/7" } },
  { country: "New Zealand", hotline: { name: "Lifeline Aotearoa", number: "0800 543 354", hours: "24/7" }, textLine: { name: "1737 Text Support", number: "Text 1737", hours: "24/7" } },
  { country: "Nicaragua", hotline: { name: "Línea de Prevención", number: "8001-8001", hours: "24/7" }, textLine: { name: "Mental Health Line", number: "2289-4200", hours: "Daily 8am-8pm" } },
  { country: "Niger", hotline: { name: "Niger Crisis Line", number: "116", hours: "Daily 8am-6pm" }, textLine: { name: "Mental Health Support", number: "20-73-00-00", hours: "Mon-Fri 9am-5pm" } },
  { country: "Nigeria", hotline: { name: "Nigeria Mental Health", number: "0800-111-2022", hours: "Daily 8am-10pm" }, textLine: { name: "Crisis Support", number: "0809-210-6389", hours: "Mon-Fri 9am-5pm" } },
  { country: "North Korea", hotline: { name: "DPRK Mental Health", number: "119", hours: "Daily 8am-6pm" }, textLine: { name: "Emergency Services", number: "112", hours: "24/7" } },
  { country: "North Macedonia", hotline: { name: "Nacionalna SOS linija", number: "2-15-315", hours: "24/7" }, textLine: { name: "Mental Health Line", number: "070-390-909", hours: "Daily 9am-9pm" } },
  { country: "Norway", hotline: { name: "Kirkens SOS", number: "22 40 00 40", hours: "24/7" }, textLine: { name: "Mental Helse", number: "116 123", hours: "Mon-Sun 6pm-midnight" } },
  { country: "Oman", hotline: { name: "Oman Mental Health", number: "24-563-666", hours: "24/7" }, textLine: { name: "Psychological Support", number: "80077000", hours: "Daily 8am-8pm" } },
  { country: "Pakistan", hotline: { name: "Umang Crisis Helpline", number: "0317-478-7723", hours: "Daily 9am-9pm" }, textLine: { name: "Mental Health Line", number: "042-111-747-111", hours: "Mon-Fri 9am-5pm" } },
  { country: "Palau", hotline: { name: "Palau Mental Health", number: "488-2552", hours: "Mon-Fri 8am-5pm" }, textLine: { name: "Crisis Support", number: "911", hours: "24/7" } },
  { country: "Palestine", hotline: { name: "Palestine Crisis Line", number: "1800-150-150", hours: "Daily 8am-8pm" }, textLine: { name: "Mental Health Support", number: "022-989-898", hours: "Mon-Fri 9am-5pm" } },
  { country: "Panama", hotline: { name: "Línea de Crisis", number: "169", hours: "24/7" }, textLine: { name: "Mental Health Support", number: "507-6170-1818", hours: "Daily 8am-8pm" } },
  { country: "Papua New Guinea", hotline: { name: "PNG Mental Health", number: "675-7100-1000", hours: "Mon-Fri 8am-5pm" }, textLine: { name: "Crisis Support", number: "000", hours: "24/7" } },
  { country: "Paraguay", hotline: { name: "141 - Línea Telefónica", number: "141", hours: "24/7" }, textLine: { name: "Mental Health Support", number: "021-496-000", hours: "Daily 8am-8pm" } },
  { country: "Peru", hotline: { name: "Línea 113", number: "113", hours: "24/7" }, textLine: { name: "Mental Health Line", number: "01-284-2266", hours: "Daily 8am-10pm" } },
  { country: "Philippines", hotline: { name: "NCMH Crisis Hotline", number: "(02) 7-989-8727", hours: "24/7" }, textLine: { name: "In Touch Community Services", number: "0917 800 1123", hours: "24/7" } },
  { country: "Poland", hotline: { name: "Telefon Zaufania", number: "116 123", hours: "24/7" }, textLine: { name: "Linia Wsparcia Emocjonalnego", number: "22 484 88 84", hours: "Mon-Fri 2pm-10pm" } },
  { country: "Portugal", hotline: { name: "SOS Voz Amiga", number: "21 354 45 45", hours: "4pm-midnight daily" }, textLine: { name: "Telefone da Amizade", number: "22 832 35 35", hours: "4pm-midnight daily" } },
  { country: "Qatar", hotline: { name: "Qatar Mental Health", number: "16000", hours: "24/7" }, textLine: { name: "Psychological Support", number: "4439-0292", hours: "Daily 8am-8pm" } },
  { country: "Romania", hotline: { name: "Telefonul Copilului", number: "116 111", hours: "24/7" }, textLine: { name: "Crisis Helpline", number: "0-800-801-200", hours: "24/7" } },
  { country: "Russia", hotline: { name: "Samaritans Russia", number: "007 (495) 625-3101", hours: "24/7" }, textLine: { name: "Psychological Help", number: "8-800-2000-122", hours: "24/7" } },
  { country: "Rwanda", hotline: { name: "Rwanda Mental Health", number: "3512", hours: "Daily 8am-6pm" }, textLine: { name: "Crisis Support", number: "114", hours: "24/7" } },
  { country: "Saint Kitts and Nevis", hotline: { name: "SKN Mental Health", number: "869-465-2521", hours: "Mon-Fri 8am-4pm" }, textLine: { name: "Crisis Support", number: "911", hours: "24/7" } },
  { country: "Saint Lucia", hotline: { name: "Saint Lucia Mental Health", number: "758-468-4343", hours: "Mon-Fri 8am-4pm" }, textLine: { name: "Crisis Support", number: "911", hours: "24/7" } },
  { country: "Saint Vincent and the Grenadines", hotline: { name: "SVG Mental Health", number: "784-456-1111", hours: "Mon-Fri 8am-4pm" }, textLine: { name: "Crisis Support", number: "911", hours: "24/7" } },
  { country: "Samoa", hotline: { name: "Samoa Mental Health", number: "800-7728", hours: "Mon-Fri 8am-5pm" }, textLine: { name: "Crisis Support", number: "996", hours: "24/7" } },
  { country: "San Marino", hotline: { name: "San Marino Mental Health", number: "+378-0549-994-111", hours: "Mon-Fri 9am-5pm" }, textLine: { name: "Crisis Support", number: "113", hours: "24/7" } },
  { country: "Sao Tome and Principe", hotline: { name: "STP Mental Health", number: "112", hours: "Daily 8am-5pm" }, textLine: { name: "Crisis Support", number: "222-2222", hours: "Mon-Fri 9am-5pm" } },
  { country: "Saudi Arabia", hotline: { name: "Saudi Mental Health", number: "920033360", hours: "24/7" }, textLine: { name: "Psychological Support", number: "920-033-700", hours: "Daily 8am-8pm" } },
  { country: "Senegal", hotline: { name: "Senegal Crisis Line", number: "116", hours: "Daily 8am-6pm" }, textLine: { name: "Mental Health Support", number: "33-825-00-00", hours: "Mon-Fri 9am-5pm" } },
  { country: "Serbia", hotline: { name: "Centar Srce", number: "0800-300-303", hours: "24/7" }, textLine: { name: "Mental Health Line", number: "011-263-0363", hours: "Daily 9am-9pm" } },
  { country: "Seychelles", hotline: { name: "Seychelles Mental Health", number: "4-611-611", hours: "Mon-Fri 8am-5pm" }, textLine: { name: "Crisis Support", number: "999", hours: "24/7" } },
  { country: "Sierra Leone", hotline: { name: "Sierra Leone Mental Health", number: "117", hours: "Daily 8am-6pm" }, textLine: { name: "Crisis Support", number: "076-801-801", hours: "Mon-Fri 9am-5pm" } },
  { country: "Singapore", hotline: { name: "Samaritans of Singapore", number: "1-767", hours: "24/7" }, textLine: { name: "Institute of Mental Health", number: "6389 2222", hours: "24/7" } },
  { country: "Slovakia", hotline: { name: "Linka Dôvery", number: "0800 500 333", hours: "24/7" }, textLine: { name: "Crisis Helpline", number: "0800-123-456", hours: "24/7" } },
  { country: "Slovenia", hotline: { name: "Zaupni Telefon Samarijan", number: "116 123", hours: "24/7" }, textLine: { name: "Mental Health Line", number: "01-520-9900", hours: "Daily 6pm-10pm" } },
  { country: "Solomon Islands", hotline: { name: "Solomon Islands Mental Health", number: "27060", hours: "Mon-Fri 8am-5pm" }, textLine: { name: "Crisis Support", number: "999", hours: "24/7" } },
  { country: "Somalia", hotline: { name: "Somalia Mental Health", number: "888", hours: "Daily 8am-6pm" }, textLine: { name: "Crisis Support", number: "4-250-250", hours: "Mon-Fri 9am-5pm" } },
  { country: "South Africa", hotline: { name: "SADAG", number: "0800 567 567", hours: "8am-8pm daily" }, textLine: { name: "Lifeline South Africa", number: "0861 322 322", hours: "24/7" } },
  { country: "South Korea", hotline: { name: "Korea Suicide Prevention Center", number: "1393", hours: "24/7" }, textLine: { name: "Mental Health Counseling", number: "1577-0199", hours: "24/7" } },
  { country: "South Sudan", hotline: { name: "South Sudan Mental Health", number: "119", hours: "Daily 8am-6pm" }, textLine: { name: "Crisis Support", number: "211-922-000", hours: "Mon-Fri 9am-5pm" } },
  { country: "Spain", hotline: { name: "Teléfono de la Esperanza", number: "717 003 717", hours: "24/7" }, textLine: { name: "Fundación ANAR", number: "900 20 20 10", hours: "24/7" } },
  { country: "Sri Lanka", hotline: { name: "Sumithrayo", number: "011-2696666", hours: "24/7" }, textLine: { name: "Mental Health Hotline", number: "1926", hours: "Daily 8am-8pm" } },
  { country: "Sudan", hotline: { name: "Sudan Mental Health", number: "9090", hours: "Daily 8am-6pm" }, textLine: { name: "Crisis Support", number: "0155-666-666", hours: "Mon-Fri 9am-5pm" } },
  { country: "Suriname", hotline: { name: "Suriname Mental Health", number: "477-7000", hours: "Mon-Fri 7am-7pm" }, textLine: { name: "Crisis Support", number: "115", hours: "24/7" } },
  { country: "Sweden", hotline: { name: "Mind - Självmordslinjen", number: "90101", hours: "24/7" }, textLine: { name: "Jourhavande Präst", number: "112", hours: "24/7" } },
  { country: "Switzerland", hotline: { name: "Die Dargebotene Hand", number: "143", hours: "24/7" }, textLine: { name: "Pro Juventute", number: "147", hours: "24/7" } },
  { country: "Syria", hotline: { name: "Syria Mental Health", number: "110", hours: "Daily 8am-6pm" }, textLine: { name: "Crisis Support", number: "011-213-2000", hours: "Mon-Fri 9am-5pm" } },
  { country: "Taiwan", hotline: { name: "Lifeline Taiwan", number: "1995", hours: "24/7" }, textLine: { name: "Taiwan Suicide Prevention Center", number: "0800-788-995", hours: "24/7" } },
  { country: "Tajikistan", hotline: { name: "Tajikistan Crisis Line", number: "1313", hours: "Daily 8am-8pm" }, textLine: { name: "Mental Health Support", number: "372-21-00-00", hours: "Mon-Fri 9am-6pm" } },
  { country: "Tanzania", hotline: { name: "Tanzania Mental Health", number: "0800-110-011", hours: "Daily 8am-6pm" }, textLine: { name: "Crisis Support", number: "112", hours: "24/7" } },
  { country: "Thailand", hotline: { name: "Department of Mental Health", number: "1323", hours: "24/7" }, textLine: { name: "Samaritans of Thailand", number: "(02) 713-6793", hours: "Daily 10am-10pm" } },
  { country: "Timor-Leste", hotline: { name: "Timor-Leste Mental Health", number: "331-1010", hours: "Mon-Fri 8am-5pm" }, textLine: { name: "Crisis Support", number: "112", hours: "24/7" } },
  { country: "Togo", hotline: { name: "Togo Crisis Line", number: "8200", hours: "Daily 8am-6pm" }, textLine: { name: "Mental Health Support", number: "22-21-00-00", hours: "Mon-Fri 9am-5pm" } },
  { country: "Tonga", hotline: { name: "Tonga Mental Health", number: "23-000", hours: "Mon-Fri 8am-5pm" }, textLine: { name: "Crisis Support", number: "911", hours: "24/7" } },
  { country: "Trinidad and Tobago", hotline: { name: "Lifeline Trinidad", number: "800-5588", hours: "24/7" }, textLine: { name: "Mental Health Hotline", number: "868-645-2800", hours: "Mon-Fri 8am-4pm" } },
  { country: "Tunisia", hotline: { name: "SOS Famille", number: "71-78-78-78", hours: "Daily 8am-8pm" }, textLine: { name: "Mental Health Support", number: "80-101-919", hours: "Mon-Fri 9am-5pm" } },
  { country: "Turkey", hotline: { name: "Yaşam Destek Hattı", number: "182", hours: "24/7" }, textLine: { name: "Mental Health Hotline", number: "444 63 66", hours: "24/7" } },
  { country: "Turkmenistan", hotline: { name: "Turkmenistan Mental Health", number: "03", hours: "Daily 8am-6pm" }, textLine: { name: "Crisis Support", number: "12-94-00-00", hours: "Mon-Fri 9am-6pm" } },
  { country: "Tuvalu", hotline: { name: "Tuvalu Mental Health", number: "20-000", hours: "Mon-Fri 8am-5pm" }, textLine: { name: "Crisis Support", number: "911", hours: "24/7" } },
  { country: "Uganda", hotline: { name: "Uganda Mental Health", number: "0800-200-200", hours: "Daily 8am-6pm" }, textLine: { name: "Crisis Support", number: "0800-221-100", hours: "Mon-Fri 9am-5pm" } },
  { country: "Ukraine", hotline: { name: "Lifeline Ukraine", number: "7333", hours: "24/7" }, textLine: { name: "Psychological Support", number: "0-800-500-335", hours: "24/7" } },
  { country: "United Arab Emirates", hotline: { name: "Dubai Community Health Centre", number: "04-344-7777", hours: "24/7" }, textLine: { name: "Priory Wellbeing Centre", number: "800-4673", hours: "Sun-Thu 8am-8pm" } },
  { country: "United Kingdom", hotline: { name: "Samaritans UK", number: "116 123", hours: "24/7" }, textLine: { name: "Shout Crisis Text Line", number: "Text SHOUT to 85258", hours: "24/7" } },
  { country: "United States", hotline: { name: "National Suicide Prevention Lifeline", number: "988", hours: "24/7" }, textLine: { name: "Crisis Text Line", number: "Text HOME to 741741", hours: "24/7" } },
  { country: "Uruguay", hotline: { name: "Apoyo Emocional", number: "*8483", hours: "24/7" }, textLine: { name: "Línea de Vida", number: "0800 0767", hours: "24/7" } },
  { country: "Uzbekistan", hotline: { name: "Uzbekistan Crisis Line", number: "1051", hours: "Daily 8am-8pm" }, textLine: { name: "Mental Health Support", number: "71-202-00-00", hours: "Mon-Fri 9am-6pm" } },
  { country: "Vanuatu", hotline: { name: "Vanuatu Mental Health", number: "22-022", hours: "Mon-Fri 8am-5pm" }, textLine: { name: "Crisis Support", number: "112", hours: "24/7" } },
  { country: "Vatican City", hotline: { name: "Vatican Health Services", number: "+39-06-6988-3333", hours: "Mon-Fri 9am-5pm" }, textLine: { name: "Emergency Services", number: "112", hours: "24/7" } },
  { country: "Venezuela", hotline: { name: "SADEC", number: "0241-8433308", hours: "Mon-Fri 8am-5pm" }, textLine: { name: "Emergency Services", number: "171", hours: "24/7" } },
  { country: "Vietnam", hotline: { name: "Vietnam Mental Health", number: "1800-599-927", hours: "Daily 8am-10pm" }, textLine: { name: "Crisis Support", number: "028-3-9292-585", hours: "Mon-Fri 9am-5pm" } },
  { country: "Yemen", hotline: { name: "Yemen Mental Health", number: "115", hours: "Daily 8am-6pm" }, textLine: { name: "Crisis Support", number: "01-200-000", hours: "Mon-Fri 9am-5pm" } },
  { country: "Zambia", hotline: { name: "Zambia Mental Health", number: "933", hours: "Daily 8am-6pm" }, textLine: { name: "Crisis Support", number: "0211-253-777", hours: "Mon-Fri 8am-5pm" } },
  { country: "Zimbabwe", hotline: { name: "Lifeline Zimbabwe", number: "09-65000", hours: "24/7" }, textLine: { name: "Friendship Bench", number: "0772-178-582", hours: "Mon-Fri 8am-5pm" } },
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
