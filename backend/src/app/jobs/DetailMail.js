import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class DetailMail {
  get key() {
    return 'DetailMail';
  }

  async handle({ data }) {
    const { enrollment, student, plan } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: `Bem vindo a GymPoint`,
      template: 'Detail',
      context: {
        studentName: student.name,
        planName: plan.title,
        planDuration: plan.duration,
        enrollmentPrice: enrollment.price,
        enrollmentStartDate: format(
          parseISO(enrollment.start_date),
          " 'dia' dd 'de' MMMM 'de' yyyy ",
          {
            locale: pt,
          }
        ),

        enrollmentEndDate: format(
          parseISO(enrollment.end_date),
          " 'dia' dd 'de' MMMM 'de' yyyy ",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new DetailMail();
