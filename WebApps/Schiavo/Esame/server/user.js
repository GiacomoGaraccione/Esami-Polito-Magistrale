class User{
    constructor(email,password,frequentCustomer,fullName,cardNumber,cvv){
        this.email=email;
        this.password=password;
        this.frequentCustomer=frequentCustomer;
        if(fullName){
            this.fullName=fullName;
        }
        if(cardNumber){
            this.cardNumber=cardNumber;
        }
        if(cvv){
            this.cvv=cvv;
        }

    }
}
module.exports = User;