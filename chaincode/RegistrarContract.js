'use strict';

const {Contract} = require('fabric-contract-api');

class RegistrarContract extends Contract {

	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.property-registration-network.regnet.registrars');
	}

	/* ****** All custom functions are defined below ***** */

	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
	async instantiate(ctx) {
		console.log('Registrar Smart Contract Instantiated');
	}


  /**
   * Approve new user registeration request
   * @param ctx - The transaction context object
   * @param name - Name of the user
   * @param aadharnumber- AddharID of the user
   * @returns {user Object}
   **/

  async approveNewUser(ctx, name, aadharnumber) {

    //Tx Initiator
		let msgSender = ctx.clientIdentity.getID();

    // composite key for accessing registration request object
    let RequestKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users',[name, aadharnumber]);

		// Fetch user UserObject with given ID from blockchain
		let Requestbuffer = await ctx.stub
				.getState(RequestKey)
				.catch(err => console.log(err));
    let UserObject=JSON.parse(Requestbuffer.toString());

		// Make sure that user request is not already approved.
		if (UserObect.flag === 'Approved') {
			throw new Error('Already approved user');
		}
    else {
      //update the user object
			 UserObect.Approver= msgSender;
			 UserObect.updatedAt=new Date();
			 UserObect.flag='Approved';
		   UserObject.upgradCoins=parseInt(0);
			}
			// Convert the JSON object to a buffer and send it to blockchain for storage
			let dataBuffer = Buffer.from(JSON.stringify(UserObject));
			await ctx.stub.putState(RequestKey, dataBuffer);
			// Return value of updated user object with approved status
			return UserObject;
		}

    /**
  	 * Get user details  from the blockchain
  	 * @param ctx - The transaction context
  	 * @param name - user name for which to fetch details
  	 * @param aadharnumber - aadharID for which to fetch details
  	 * @returns
  	 */

  	async viewUser(ctx,name, aadharnumber) {
  		// Create the composite key required to fetch record from blockchain
  		const userKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users', [name, aadharnumber]);

  		// Return value of user details from blockchain
  		let userBuffer = await ctx.stub
  				.getState(userKey)
  				.catch(err => console.log(err));

  		//Check whetehr the user object is stored on the blockchain or not
  				if(userBuffer){
  					return JSON.parse(userBuffer.toString());
  				}
  				else { throw new Error('The user is not registered on the network');
  				}
  	}

    /**
  	 * Approve Property Registration Request by the registrar over the network
  	 * @param ctx
  	 * @param propertyID - Identifer of real world property
  	 * @returns {Updated Property Object}
  	 */


    async approvePropertyRegistration(ctx, PropertyID) {
      //registrar ID
      let msgSender = ctx.clientIdentity.getID();
      // Create the composite key required to fetch record from blockchain
      let propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.property',[PropertyID]);

      // Fetch property with given ID from blockchain
      let Propertybuffer = await ctx.stub
          .getState(propertyKey)
          .catch(err => console.log(err));
      let PropertyObject=JSON.parse(Propertybuffer.toString());

      //Update Property Object
         PropertyObect.Approver= msgSender;
         PropertyObect.status='registered';
         PropertyObect.updatedAt=new Date();

         //Store the udpated property object to the blockchain
        let dataBuffer = Buffer.from(JSON.stringify(PropertyObject));
        await ctx.stub.putState(propertyKey, dataBuffer);

        return PropertyObect;
    }

    /**
     * Get Property Details registered over the network
     * @param propertyID - Identifer of real world property
     * @returns {property object}
     */

    async viewProperty(ctx, PropertyID){

     const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.property',[PropertyID]);

     // Return value of property object in buffer form from blockchain
     let PropertyBuffer = await ctx.stub
         .getState(propertyKey)
         .catch(err => console.log(err));

         if(PropertyBuffer){
           return JSON.parse(PropertyBuffer.toString());
         }
         else { throw new Error('The property is not registered on the network');
         }
       }
	}

  module.exports = RegistrarContract;
