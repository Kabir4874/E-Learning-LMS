export interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}
