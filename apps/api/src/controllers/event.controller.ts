import { Request, Response } from 'express';
import { eventRepository } from '@/repositories/event.repository';
import { verifyJWT } from '@/utils/jwt.utils';
import { JwtPayload } from 'jsonwebtoken';
import { DashboardRepository } from '@/repositories/dashboard.repository';

export class EventController {
  public async getAllEvent (req: Request, res: Response): Promise<void | Response> {
    const token : JwtPayload = await verifyJWT(req.headers.authorization!) as JwtPayload

    const data = await eventRepository.allEvent({userId: token.id||undefined})
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
  public async makeTransaction (req: Request, res: Response): Promise<void | Response> {
    console.log(req.body.usersCouponId);
    
    const data = await eventRepository.makeEventTransaction({
      eventId : Number(req.body.eventId) as number,
      usePoint  : req.body.usePoint as boolean,
      userId  : Number(req.body.jwtPayload.id) as number,
      paymentDate : new Date(req.body.paymentDate) as Date,
      usersCouponId : Number(req.body.usersCouponId) as number
    })

    if (data.ok) {
      return res.status(201).send({
        data : data.data,
        ok : true
      })
    }
    return res.status(data.code||500).send({
      error: data.error,
      ok: false
    })
  }

  public async getEventDashboard (req: Request, res: Response): Promise<void | Response> {
    
    const ownerId = req.body.jwtPayload as JwtPayload

    const organization = new DashboardRepository(Number(ownerId.id) as number)
    const dashboardData  = await organization.getEventDashboardData()

    if (!dashboardData.ok) {
      return res.status(404).send({message : 'not found'})
    }
    return res.status(200).send({dashboardData})
  }
}
