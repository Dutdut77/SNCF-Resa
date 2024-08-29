import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default defineEventHandler(async (event) => {
  try {
  
    const body = await readBody(event)


    // const data = await resend.emails.send({
    //   from: body.from,
    //   to: body.to,
    //   subject: body.subject,
    //   html: body.html,
    // });

    // return data;

console.log("simulation Envoi Email");
return true

  } catch (error) {
    return { error };
  }
});
