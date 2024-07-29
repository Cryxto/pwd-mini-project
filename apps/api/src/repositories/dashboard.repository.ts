import prisma from '@/prisma';

export class DashboardRepository {
  private user: number;

  /**
   * setUser
   */
  public setUser(user: number) {
    this.user = user
  }
  constructor (user:number){
    this.user = user
  }
  /**
   * getEventDashboardData
   */
  public async getEventDashboardData() {
    try {
      const data = await prisma.organization.findMany(
        {
          where: {
            ownerId : this.user
          },
          include : {
            Event : {
              include : {
                EventTransaction : {
                  include : {
                    Attendee : {
                      omit: {password: true}
                    }
                  }
                }
              }
            }
          }
        }
      )
      if (data.length<0) {
        return {error: data, ok : false}
      }
      return {data, ok : true}
    } catch (error: any) {

      return {error, ok: false}

    }
  }
}

// export const dashboardRepository = new DashboardRepository();
