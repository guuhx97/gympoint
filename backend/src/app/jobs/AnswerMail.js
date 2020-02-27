import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class DetailMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { question, answer, answer_at, student } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: `Uma Nova Resposta`,
      template: 'Answer',
      context: {
        studentName: student.name,
        question,
        answer,
        answerDate: format(parseISO(answer_at), "dd'/'MM'/'yyyy"),
      },
    });
  }
}
export default new DetailMail();
