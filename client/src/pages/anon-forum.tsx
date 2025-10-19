import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function AnonForum() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-4xl font-display font-semibold text-foreground mb-2">
          Anonymous Message Forum
        </h1>
        <p className="text-muted-foreground text-lg">
          A safe space to share thoughts and connect anonymously
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The Anonymous Message Forum is currently under development. Check back soon for a safe and supportive community space!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
