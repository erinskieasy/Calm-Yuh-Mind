import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, ArrowLeft, Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AssessmentResult, InsertAssessmentResult } from "@shared/schema";

type Question = {
  text: string;
  originalIndex: number;
};

type Assessment = {
  id: string;
  name: string;
  description: string;
  category: string;
  questions: string[];
  options: { value: number; label: string }[];
};

const assessments: Assessment[] = [
  {
    id: "phq-9",
    name: "PHQ-9 Depression Screening",
    description: "A brief questionnaire to assess symptoms of depression",
    category: "Depression",
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
    category: "Anxiety",
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
  {
    id: "pss-10",
    name: "Perceived Stress Scale (PSS-10)",
    description: "Measure your stress levels over the past month",
    category: "Stress",
    questions: [
      "How often have you been upset because of something that happened unexpectedly?",
      "How often have you felt that you were unable to control the important things in your life?",
      "How often have you felt nervous and stressed?",
      "How often have you felt confident about your ability to handle your personal problems?",
      "How often have you felt that things were going your way?",
      "How often have you found that you could not cope with all the things that you had to do?",
      "How often have you been able to control irritations in your life?",
      "How often have you felt that you were on top of things?",
      "How often have you been angered because of things that were outside of your control?",
      "How often have you felt difficulties were piling up so high that you could not overcome them?",
    ],
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Fairly often" },
      { value: 4, label: "Very often" },
    ],
  },
  {
    id: "rosenberg-ses",
    name: "Rosenberg Self-Esteem Scale",
    description: "Assess your overall feelings of self-worth",
    category: "Self-Esteem",
    questions: [
      "I feel that I am a person of worth, at least on an equal plane with others",
      "I feel that I have a number of good qualities",
      "All in all, I am inclined to feel that I am a failure",
      "I am able to do things as well as most other people",
      "I feel I do not have much to be proud of",
      "I take a positive attitude toward myself",
      "On the whole, I am satisfied with myself",
      "I wish I could have more respect for myself",
      "I certainly feel useless at times",
      "At times I think I am no good at all",
    ],
    options: [
      { value: 0, label: "Strongly disagree" },
      { value: 1, label: "Disagree" },
      { value: 2, label: "Agree" },
      { value: 3, label: "Strongly agree" },
    ],
  },
  {
    id: "ucla-loneliness",
    name: "UCLA Loneliness Scale (Short)",
    description: "Evaluate your sense of social connection and loneliness",
    category: "Social Connection",
    questions: [
      "How often do you feel that you lack companionship?",
      "How often do you feel left out?",
      "How often do you feel isolated from others?",
      "How often do you feel alone?",
      "How often do you feel part of a group of friends?",
      "How often do you feel that you have a lot in common with the people around you?",
      "How often do you feel close to people?",
      "How often do you feel that your relationships are meaningful?",
    ],
    options: [
      { value: 1, label: "Never" },
      { value: 2, label: "Rarely" },
      { value: 3, label: "Sometimes" },
      { value: 4, label: "Often" },
    ],
  },
  {
    id: "pcl-5-short",
    name: "PTSD Checklist (PCL-5 Short)",
    description: "Screen for symptoms of post-traumatic stress",
    category: "Trauma",
    questions: [
      "Repeated, disturbing, and unwanted memories of the stressful experience",
      "Repeated, disturbing dreams of the stressful experience",
      "Suddenly feeling or acting as if the stressful experience were actually happening again",
      "Feeling very upset when something reminded you of the stressful experience",
      "Avoiding memories, thoughts, or feelings related to the stressful experience",
      "Avoiding external reminders of the stressful experience",
      "Having strong negative beliefs about yourself, other people, or the world",
      "Feeling distant or cut off from other people",
    ],
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "A little bit" },
      { value: 2, label: "Moderately" },
      { value: 3, label: "Quite a bit" },
      { value: 4, label: "Extremely" },
    ],
  },
];

// Shuffle questions while maintaining their original indices for scoring
const shuffleQuestions = (questions: string[]): Question[] => {
  const questionsWithIndex = questions.map((text, index) => ({
    text,
    originalIndex: index,
  }));
  
  // Fisher-Yates shuffle
  for (let i = questionsWithIndex.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionsWithIndex[i], questionsWithIndex[j]] = [questionsWithIndex[j], questionsWithIndex[i]];
  }
  
  return questionsWithIndex;
};

export default function Assessment() {
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
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
  const totalQuestions = shuffledQuestions.length || 0;
  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

  useEffect(() => {
    if (selectedAssessment && assessment) {
      setShuffledQuestions(shuffleQuestions(assessment.questions));
    }
  }, [selectedAssessment, assessment]);

  const handleAnswer = (value: number) => {
    const currentOriginalIndex = shuffledQuestions[currentQuestion].originalIndex;
    const newAnswers = { ...answers, [currentOriginalIndex]: value };
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score using original question indices
      const answersArray = assessment!.questions.map((_, idx) => newAnswers[idx] || 0);
      
      // Handle reverse scoring for PSS and Rosenberg
      let score = 0;
      if (selectedAssessment === "pss-10") {
        // Items 4, 5, 7, 8 are reverse scored
        answersArray.forEach((ans, idx) => {
          if ([3, 4, 6, 7].includes(idx)) {
            score += 4 - ans; // Reverse score
          } else {
            score += ans;
          }
        });
      } else if (selectedAssessment === "rosenberg-ses") {
        // Items 3, 5, 8, 9, 10 are reverse scored (indices 2, 4, 7, 8, 9)
        answersArray.forEach((ans, idx) => {
          if ([2, 4, 7, 8, 9].includes(idx)) {
            score += 3 - ans; // Reverse score
          } else {
            score += ans;
          }
        });
      } else if (selectedAssessment === "ucla-loneliness") {
        // Items 5, 6, 7, 8 are reverse scored (indices 4, 5, 6, 7)
        answersArray.forEach((ans, idx) => {
          if ([4, 5, 6, 7].includes(idx)) {
            score += 5 - ans; // Reverse score (1-4 scale)
          } else {
            score += ans;
          }
        });
      } else {
        score = answersArray.reduce((sum, val) => sum + val, 0);
      }
      
      const today = new Date().toISOString().split("T")[0];
      const questionOrder = shuffledQuestions.map(q => q.originalIndex);
      
      saveResult.mutate({
        type: selectedAssessment!,
        score,
        answers: JSON.stringify(answersArray),
        questionOrder: JSON.stringify(questionOrder),
        date: today,
      });
      setShowResults(true);
    }
  };

  const resetAssessment = () => {
    setSelectedAssessment(null);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setShuffledQuestions([]);
  };

  const getScoreInterpretation = (score: number, type: string) => {
    switch (type) {
      case "phq-9":
        if (score <= 4) return { level: "Minimal", color: "hsl(160, 45%, 65%)" };
        if (score <= 9) return { level: "Mild", color: "hsl(45, 85%, 70%)" };
        if (score <= 14) return { level: "Moderate", color: "hsl(25, 75%, 65%)" };
        if (score <= 19) return { level: "Moderately Severe", color: "hsl(10, 70%, 60%)" };
        return { level: "Severe", color: "hsl(0, 65%, 48%)" };
        
      case "gad-7":
        if (score <= 4) return { level: "Minimal", color: "hsl(160, 45%, 65%)" };
        if (score <= 9) return { level: "Mild", color: "hsl(45, 85%, 70%)" };
        if (score <= 14) return { level: "Moderate", color: "hsl(25, 75%, 65%)" };
        return { level: "Severe", color: "hsl(0, 65%, 48%)" };
        
      case "pss-10":
        if (score <= 13) return { level: "Low Stress", color: "hsl(160, 45%, 65%)" };
        if (score <= 26) return { level: "Moderate Stress", color: "hsl(45, 85%, 70%)" };
        return { level: "High Stress", color: "hsl(0, 65%, 48%)" };
        
      case "rosenberg-ses":
        if (score >= 25) return { level: "High Self-Esteem", color: "hsl(160, 45%, 65%)" };
        if (score >= 15) return { level: "Normal Self-Esteem", color: "hsl(45, 85%, 70%)" };
        return { level: "Low Self-Esteem", color: "hsl(0, 65%, 48%)" };
        
      case "ucla-loneliness":
        if (score <= 16) return { level: "Low Loneliness", color: "hsl(160, 45%, 65%)" };
        if (score <= 24) return { level: "Moderate Loneliness", color: "hsl(45, 85%, 70%)" };
        return { level: "High Loneliness", color: "hsl(0, 65%, 48%)" };
        
      case "pcl-5-short":
        if (score <= 10) return { level: "Minimal", color: "hsl(160, 45%, 65%)" };
        if (score <= 20) return { level: "Mild", color: "hsl(45, 85%, 70%)" };
        if (score <= 30) return { level: "Moderate", color: "hsl(25, 75%, 65%)" };
        return { level: "Severe", color: "hsl(0, 65%, 48%)" };
        
      default:
        return { level: "Unknown", color: "hsl(220, 13%, 69%)" };
    }
  };

  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const interpretation = selectedAssessment
    ? getScoreInterpretation(totalScore, selectedAssessment)
    : null;

  const groupedAssessments = assessments.reduce((acc, assess) => {
    if (!acc[assess.category]) {
      acc[assess.category] = [];
    }
    acc[assess.category].push(assess);
    return acc;
  }, {} as Record<string, Assessment[]>);

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
          {Object.entries(groupedAssessments).map(([category, categoryAssessments]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-2xl font-display font-semibold flex items-center gap-2">
                {category}
                {categoryAssessments.length > 0 && (
                  <span className="text-sm text-muted-foreground font-normal">
                    ({categoryAssessments.length})
                  </span>
                )}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categoryAssessments.map((assess) => (
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
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-primary font-medium">
                          {assess.questions.length} questions
                        </p>
                        <Shuffle className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

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
                  .slice(0, 10)
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
                  {selectedAssessment?.includes("ucla") || selectedAssessment?.includes("pss")
                    ? "In the past month:"
                    : selectedAssessment?.includes("rosenberg")
                    ? "Please indicate how much you agree:"
                    : selectedAssessment?.includes("pcl")
                    ? "In the past month, how much were you bothered by:"
                    : "Over the last 2 weeks, how often have you been bothered by:"}
                </h3>
                <p className="text-lg leading-relaxed">
                  {shuffledQuestions[currentQuestion]?.text}
                </p>
              </div>

              <RadioGroup
                value={answers[shuffledQuestions[currentQuestion]?.originalIndex]?.toString()}
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
