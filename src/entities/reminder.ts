// import { Entity } from '@entities/entity';
// import User from '@entities/user';

// interface Reminder {
//   id: number;
//   title: string;
//   description: string;
//   user: User;
// }

// class Reminder implements Reminder, Entity {
//   public id: number;

//   public title: string;

//   public description: string;

//   public user: User;

//   constructor(title: string, description: string, user: User, id?: number) {
//     this.title = title;
//     this.description = description;
//     this.user = user;
//     this.id = id || -1;
//   }

//   toDBValues(): string {
//     return `('${this.title}', '${this.description}', '${this.user.id}')`;
//   }
// }

// export default Reminder;
