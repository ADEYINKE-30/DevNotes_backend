import Quiz from '../models/Quiz.js';
import QuizQuestion from '../models/QuizQuestion.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Tutorial from '../models/Tutorial.js';
import type { QuizInput, QuizQuestionInput, QuizSubmission } from '../types/quiz.js';
import { Types } from 'mongoose';

const serializeQuiz = (quiz: Record<string, unknown>) => ({
  ...quiz,
  id: quiz._id?.toString?.() ?? quiz.id,
  tutorial: typeof quiz.tutorial === 'object' ? quiz.tutorial : quiz.tutorial?.toString?.() ?? quiz.tutorial
});

const serializeQuestion = (question: Record<string, unknown>, hideCorrectAnswer = false) => {
  const serialized: Record<string, unknown> = {
    ...question,
    id: question._id?.toString?.() ?? question.id,
    quiz: question.quiz?.toString?.() ?? question.quiz
  };
  
  if (hideCorrectAnswer) {
    delete serialized.correctAnswer;
  }
  
  return serialized;
};

const serializeAttempt = (attempt: Record<string, unknown>) => ({
  ...attempt,
  id: attempt._id?.toString?.() ?? attempt.id,
  user: attempt.user?.toString?.() ?? attempt.user,
  quiz: typeof attempt.quiz === 'object' ? attempt.quiz : attempt.quiz?.toString?.() ?? attempt.quiz
});

// Quiz services
export const getQuizzesService = async ({
  page = 1,
  limit = 10,
  tutorial,
  search
}: {
  page?: number;
  limit?: number;
  tutorial?: string;
  search?: string;
}) => {
  const query: Record<string, unknown> = { published: true };

  if (tutorial) {
    query.tutorial = tutorial;
  }

  if (search) {
    query.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') }
    ];
  }

  const skip = (page - 1) * limit;

  const [quizzes, total] = await Promise.all([
    Quiz.find(query).populate('tutorial').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Quiz.countDocuments(query)
  ]);

  return {
    quizzes: quizzes.map(serializeQuiz),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getQuizByIdService = async (id: string, includeQuestions = false) => {
  const quiz = await Quiz.findById(id).populate('tutorial').lean();
  
  if (!quiz) {
    return null;
  }

  const serialized: any = serializeQuiz(quiz as Record<string, unknown>);

  if (includeQuestions) {
    const questions = await QuizQuestion.find({ quiz: id }).sort({ order: 1 }).lean();
    serialized.questions = questions.map((q) => 
      serializeQuestion(q as Record<string, unknown>, true)
    );
  }

  return serialized;
};

export const createQuizService = async (payload: QuizInput) => {
  // Verify tutorial exists
  const tutorial = await Tutorial.findById(payload.tutorial);
  if (!tutorial) {
    const error = new Error('Tutorial not found');
    (error as { statusCode?: number }).statusCode = 404;
    throw error;
  }

  const quiz = await Quiz.create({
    ...payload,
    published: payload.published ?? false,
    publishedAt: payload.published ? new Date() : undefined
  });

  return serializeQuiz(quiz.toObject() as unknown as Record<string, unknown>);
};

export const updateQuizService = async (id: string, payload: Partial<QuizInput>) => {
  const updateData = { ...payload };

  // Set publishedAt when publishing
  if (payload.published === true) {
    const existing = await Quiz.findById(id);
    if (existing && !existing.published) {
      (updateData as { publishedAt?: Date }).publishedAt = new Date();
    }
  }

  const quiz = await Quiz.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  }).lean();

  return quiz ? serializeQuiz(quiz as Record<string, unknown>) : null;
};

export const deleteQuizService = async (id: string) => {
  // Delete associated questions
  await QuizQuestion.deleteMany({ quiz: id });
  
  // Delete associated attempts
  await QuizAttempt.deleteMany({ quiz: id });
  
  // Delete the quiz
  return Quiz.findByIdAndDelete(id);
};

// Question services
export const getQuestionsByQuizService = async (quizId: string, hideCorrectAnswers = true) => {
  const questions = await QuizQuestion.find({ quiz: quizId }).sort({ order: 1 }).lean();
  return questions.map((q) => serializeQuestion(q as Record<string, unknown>, hideCorrectAnswers));
};

export const createQuestionService = async (quizId: string, payload: QuizQuestionInput) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    const error = new Error('Quiz not found');
    (error as { statusCode?: number }).statusCode = 404;
    throw error;
  }

  const question = await QuizQuestion.create({
    ...payload,
    quiz: quizId
  });

  return serializeQuestion(question.toObject() as unknown as Record<string, unknown>);
};

export const updateQuestionService = async (id: string, payload: Partial<QuizQuestionInput>) => {
  const question = await QuizQuestion.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true
  }).lean();

  return question ? serializeQuestion(question as Record<string, unknown>) : null;
};

export const deleteQuestionService = async (id: string) => {
  return QuizQuestion.findByIdAndDelete(id);
};

// Attempt services
export const startQuizService = async (quizId: string, userId: string) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    const error = new Error('Quiz not found');
    (error as { statusCode?: number }).statusCode = 404;
    throw error;
  }

  if (!quiz.published) {
    const error = new Error('Quiz is not published');
    (error as { statusCode?: number }).statusCode = 403;
    throw error;
  }

  const attempt = await QuizAttempt.create({
    user: userId,
    quiz: quizId,
    answers: [],
    score: 0,
    percentage: 0,
    passed: false,
    startedAt: new Date()
  });

  return serializeAttempt(attempt.toObject() as unknown as Record<string, unknown>);
};

export const submitQuizService = async (
  submission: QuizSubmission,
  userId: string | Types.ObjectId
) => {
  const attempt = await QuizAttempt.findById(submission.attemptId);
  
  if (!attempt) {
    const error = new Error('Quiz attempt not found');
    (error as { statusCode?: number }).statusCode = 404;
    throw error;
  }

  if (attempt.user.toString() !== userId.toString()) {
    const error = new Error('Unauthorized to submit this quiz');
    (error as { statusCode?: number }).statusCode = 403;
    throw error;
  }

  if (attempt.submittedAt) {
    const error = new Error('Quiz already submitted');
    (error as { statusCode?: number }).statusCode = 400;
    throw error;
  }

  const quiz = await Quiz.findById(attempt.quiz);
  if (!quiz) {
    const error = new Error('Quiz not found');
    (error as { statusCode?: number }).statusCode = 404;
    throw error;
  }

  // Get all questions for the quiz
  const questions = await QuizQuestion.find({ quiz: attempt.quiz }).lean();
  
  if (questions.length === 0) {
    const error = new Error('Quiz has no questions');
    (error as { statusCode?: number }).statusCode = 400;
    throw error;
  }

  // Evaluate answers
  let totalPoints = 0;
  let earnedPoints = 0;
  const evaluatedAnswers = [];

  for (const question of questions) {
    totalPoints += question.points;
    
    const userAnswer = submission.answers.find(
      (a) => a.question === question._id.toString()
    );

    if (userAnswer) {
      const isCorrect = userAnswer.answer.trim().toLowerCase() === 
                       question.correctAnswer.trim().toLowerCase();
      const pointsEarned = isCorrect ? question.points : 0;
      earnedPoints += pointsEarned;

      evaluatedAnswers.push({
        question: question._id,
        userAnswer: userAnswer.answer,
        isCorrect,
        pointsEarned
      });
    } else {
      evaluatedAnswers.push({
        question: question._id,
        userAnswer: '',
        isCorrect: false,
        pointsEarned: 0
      });
    }
  }

  // Calculate percentage
  const percentage = totalPoints > 0 
    ? Math.min(Math.round((earnedPoints / totalPoints) * 100), 100)
    : 0;

  // Determine pass/fail
  const passed = percentage >= quiz.passingScore;

  // Update attempt
  attempt.answers = evaluatedAnswers as any;
  attempt.score = earnedPoints;
  attempt.percentage = percentage;
  attempt.passed = passed;
  attempt.submittedAt = new Date();
  
  await attempt.save();

  // Prepare result with explanations for incorrect answers
  const result = {
    score: earnedPoints,
    totalPoints,
    percentage,
    passed,
    answers: evaluatedAnswers.map((answer) => {
      const question = questions.find((q) => q._id.toString() === answer.question.toString());
      return {
        question: question?._id.toString(),
        questionText: question?.question,
        userAnswer: answer.userAnswer,
        correctAnswer: question?.correctAnswer,
        isCorrect: answer.isCorrect,
        pointsEarned: answer.pointsEarned,
        explanation: !answer.isCorrect ? question?.explanation : undefined
      };
    })
  };

  return result;
};

export const getQuizResultsService = async (quizId: string, userId: string) => {
  const attempts = await QuizAttempt.find({
    user: userId,
    quiz: quizId,
    submittedAt: { $exists: true }
  })
    .sort({ submittedAt: -1 })
    .lean();

  return attempts.map(serializeAttempt);
};

export const getUserQuizzesService = async (userId: string) => {
  const attempts = await QuizAttempt.find({
    user: userId,
    submittedAt: { $exists: true }
  })
    .populate('quiz')
    .sort({ submittedAt: -1 })
    .lean();

  return {
    attempts: attempts.map(serializeAttempt)
  };
};
