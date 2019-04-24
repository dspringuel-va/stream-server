import express, { NextFunction, Express, Request, Response } from 'express';

const port = 13000;
const app: Express = express();

app.use(function(req: Request, response: Response, next: NextFunction) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Based on Server sent events: https://html.spec.whatwg.org/multipage/server-sent-events.html
app.get('/stream', (request: Request, response: Response) => {
  console.log(`Client opened the connection.`);
  response.header("Content-Type", "text/event-stream");
  response.header("Connection", "keep-alive");

  response.write('event: hello\n');
  response.write('data: Hello World!\n\n');

  let i = 1;
  const stream = () => {
    response.write(`id: ${i}\n`);

    if (i > 10) {
      response.write(`event: streamEnd\n`);
      response.write(`data: Stream ended\n\n`);
      return;
    }

    console.log(`Sending message ${i}`);
    response.write(`data: Stream ${i}\n\n`)
    i += 1;
    setTimeout(stream, 500);
  }
  stream();

  request.on('close', () => {
    console.log(`Client closed the connection.\n`);
  })
});

app.listen(port, () => {
  console.log(`Server listening to ${port}`);
});
