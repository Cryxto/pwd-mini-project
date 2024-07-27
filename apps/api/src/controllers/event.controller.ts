import { Request, Response } from 'express';
import { eventRepository } from '@/repositories/event.repository';

export class EventController {
  public async getAllEvent (req: Request, res: Response): Promise<void | Response> {
    const data = await eventRepository.allEvent()
    if (data.ok) {
      return res.status(200).send({
        data : data,
        ok : true
      })
    }
    return res.status(500).send({
      error: data.error,
      ok: false
    })
  }
  public async getSingleEvent (req: Request, res: Response): Promise<void | Response> {
    const data = await eventRepository.singleEvent(req.params.slug)
    if (data.ok) {
      return res.status(200).send({
        data : data,
        ok : true
      })
    }
    return res.status(500).send({
      error: data.error,
      ok: false
    })
  }
}
