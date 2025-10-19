import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AssessmentResult, InsertAssessmentResult } from "@shared/schema";

const assessments = [
  {
    id: "phq-9",
    name: "PHQ-9 Depression Screening",
    description: "A brief questionnaire to assess symptoms of depression",
    questions: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself or that you are a failure",
      "Trouble concentrating on things",
      "Moving or speaking slowly, or being fidgety or restless",
      "Thoughts that you would be better off dead or hurting yourself",
    ],
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "gad-7",
    name: "GAD-7 Anxiety Screening",
    description: "A questionnaire to measure symptoms of generalized anxiety",
    questions: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it's hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid as if something awful might happen",
    ],
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
];

export default function Assessment() {
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const { data: results = [] } = useQuery<AssessmentResult[]>({
    queryKey: ["/api/assessments"],
  });

  const saveResult = useMutation({
    mutationFn: async (data: InsertAssessmentResult) => {
      return await apiRequest("POST", "/api/assessments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      toast({
        title: "Assessment saved",
        description: "Your results have been recorded.",
      });
    },
  });

  const assessment = assessments.find((a) => a.id === selectedAssessment);
  const totalQuestions = assessment?.questions.length || 0;
  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const score = newAnswers.reduce((sum, val) => sum + val, 0);
      const today = new Date().toISOString().split("T")[0];
      saveResult.mutate({
        type: selectedAssessment!,
        score,
        answers: JSON.stringify(newAnswers),
        date: today,
      });
      setShowResults(true);
    }
  };

  const resetAssessment = () => {
    setSelectedAssessment(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const getScoreInterpretation = (score: number, type: string) => {
    if (type === "phq-9") {
      if (score <= 4) return { level: "Minimal", color: "hsl(160, 45%, 65%)" };
      if (score <= 9) return { level: "Mild", color: "hsl(45, 85%, 70%)" };
      if (score <= 14) return { level: "Moderate", color: "hsl(25, 75%, 65%)" };
      if (score <= 19) return { level: "Moderately Severe", color: "hsl(10, 70%, 60%)" };
      return { level: "Severe", color: "hsl(0, 65%, 48%)" };
    } else {
      if (score <= 4) return { level: "Minimal", color: "hsl(160, 45%, 65%)" };
      if (score <= 9) return { level: "Mild", color: "hsl(45, 85%, 70%)" };
      if (score <= 14) return { level: "Moderate", color: "hsl(25, 75%, 65%)" };
      return { level: "Severe", color: "hsl(0, 65%, 48%)" };
    }
  };

  const totalScore = answers.reduce((sum, val) => sum + val, 0);
  const interpretation = selectedAssessment
    ? getScoreInterpretation(totalScore, selectedAssessment)
    : null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        {selectedAssessment && (
          <Button
            variant="ghost"
            size="icon"
            onClick={resetAssessment}
            data-testid="button-back-assessments"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-4xl font-display font-semibold text-foreground mb-2">
            Self-Assessment
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your mental health with validated tools
          </p>
        </div>
      </div>

      {!selectedAssessment ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assessments.map((assess) => (
              <Card
                key={assess.id}
                className="p-6 cursor-pointer hover-elevate active-elevate-2"
                onClick={() => setSelectedAssessment(assess.id)}
                data-testid={`card-assessment-${assess.id}`}
              >
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl font-display">
                    {assess.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <p className="text-muted-foreground">{assess.description}</p>
                  <p className="text-sm text-primary font-medium mt-4">
                    {assess.questions.length} questions
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {results.length > 0 && (
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl font-display">
                  Previous Results
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-4">
                {results
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .slice(0, 5)
                  .map((result) => {
                    const assess = assessments.find((a) => a.id === result.type);
                    const interp = getScoreInterpretation(
                      result.score,
                      result.type
                    );
                    return (
                      <div
                        key={result.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted"
                        data-testid={`result-${result.id}`}
                      >
                        <div>
                          <p className="font-medium">{assess?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(result.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-display font-semibold">
                            {result.score}
                          </p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: interp.color }}
                          >
                            {interp.level}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          )}
        </>
      ) : showResults ? (
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <CardContent className="p-0 space-y-6 text-center">
              <ClipboardList className="h-16 w-16 mx-auto text-primary" />
              <div>
                <h2 className="text-3xl font-display font-semibold mb-2">
                  Assessment Complete
                </h2>
                <p className="text-muted-foreground">
                  {assessment?.name}
                </p>
              </div>
              <div
                className="p-8 rounded-2xl"
                style={{ backgroundColor: `${interpretation?.color}20` }}
              >
                <p className="text-6xl font-display font-semibold mb-2">
                  {totalScore}
                </p>
                <p
                  className="text-xl font-medium"
                  style={{ color: interpretation?.color }}
                >
                  {interpretation?.level}
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is a screening tool, not a diagnosis. If you're concerned
                about your mental health, please consult with a healthcare
                professional.
              </p>
              <Button onClick={resetAssessment} data-testid="button-finish">
                Back to Assessments
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <CardContent className="p-0 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Question {currentQuestion + 1} of {totalQuestions}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-display">
                  Over the last 2 weeks, how often have you been bothered by:
                </h3>
                <p className="text-lg leading-relaxed">
                  {assessment?.questions[currentQuestion]}
                </p>
              </div>

              <RadioGroup
                value={answers[currentQuestion]?.toString()}
                onValueChange={(value) => handleAnswer(Number(value))}
              >
                <div className="space-y-3">
                  {assessment?.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 p-4 rounded-lg hover-elevate border"
                    >
                      <RadioGroupItem
                        value={option.value.toString()}
                        id={`option-${option.value}`}
                        data-testid={`radio-option-${option.value}`}
                      />
                      <Label
                        htmlFor={`option-${option.value}`}
                        className="flex-1 cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
