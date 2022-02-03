'use strict';

const {Contract} = require('fabric-contract-api');

class UserContract extends Contract {

	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.property-registration-network.regnet.users');
	}

	/* ****** All custom functions are defined below ***** */

	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
	async instantiate(ctx) {
		console.log('User Smart Contract Instantiated');
	}

	/**
	 * Initiate a request to register on the property-registration network
	 * @param ctx - The transaction context object
	 * @param name - Name of the user
	 * @param email - Email ID of the user
	 * @param phonenumber - phonenumber of the user
	 * @param aadharnumber- AddharID of the user
	 * @returns Property Registration Request Object
	 **/
	async requestNewUser(ctx, name, email, phonenumber, aadharnumber) {
		// new composite key for the new user
		const userKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users', [name, aadharnumber]);

		// Create a student object to be stored in blockchain
		let newRequest = {
			name: name,
			email: email,
      phonenumber: phonenumber;
      UserID: ctx.clientIdentity.getID(),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		// Convert the JSON object to a buffer and send it to blockchain for storage
		let dataBuffer = Buffer.from(JSON.stringify(newRequest));
		await ctx.stub.putState(userKey, dataBuffer);
		// Return value of new userRequest created to user
		return newRequest;
	}

	/**
	 * add upgradCoins in user's account
	 * @param ctx - The transaction context object
	 * @param name - Name of the user
	 * @param aadharnumber- AddharID of the user
	 * @param BankTransactionID- Transaction ID corresponding to transaction for buying upgradcoings
	 * @returns Property Registration Request Object
	 **/

	async rechargeAccount(ctx, name, aadharnumber, BankTransactionID

			// composite key for accessing user data from the blockchain
		const userKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users', [name, aadharnumber]);

		let TxtoCoins=new Map();
		TxtoCoins.set('upg100',100);
		TxtoCoins.set('upg500',500);
		TxtoCoins.set('upg1000',1000);

		// Return value of user details from blockchain
		let dataBuffer = await ctx.stub
				.getState(userKey)
				.catch(err => console.log(err));

		if(dataBuffer!==undefined && TxtoCoins.has(BankTransactionID)){

				let user=JSON.parse(dataBuffer.toString());

				//check user whether registration request is approved or not

				if(user.flag==='Approved'){
							//update the user object
					user.upgradCoins=user.upgradCoins+TxtoCoins.get(BankTransactionID);
					user.updatedAt=new Date();
					// Convert the JSON object to a buffer and send it to blockchain for storage
					let dataBuffer = Buffer.from(JSON.stringify(newRequest));
					await ctx.stub.putState(userKey, dataBuffer);
				}
				else{
					throw new Error('The user is not approved');
				}
		}
		else{
			 throw new Error('Either the user or the BankTransactionID is not valid');
		}
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

		//Check whether the user object is stored on the blockchain or not
				if(userBuffer){
					return JSON.parse(userBuffer.toString());
				}
				else { throw new Error('The user is not registered on the network');
				}
	}

	/**
	 * Generate Property Registration Request over the network
	 * @param ctx
	 * @param propertyID - Identifer of real world property
	 * @param Price - Price of the property
	 * @param name -  property owner Name
	 * @param aadharId -  property owner aadhar ID
	 * @returns {Property Object}
	 */
	async propertyRegistrationRequest(ctx, PropertyID, Price, name, aadharId){
		// Create the composite key required to fetch record from blockchain
		const userKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users', [name, aadharid]);
		// Return value of user details from blockchain
		let userBuffer = await ctx.stub
			.getState(userKey)
			.catch(err => console.log(err));
			let user=JSON.parse(dataBuffer.toString());

			//Check whether the property owner is valid user or not
			if(user.flag==='Approved'){

				// Create the composite key for the property asset
				const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.property', [PropertyID]);

				//create property asset object
				let PropertyObject = {
					PropertyID: PropertyID,
					owner: name+'-'+aadharId,
					Price: Price
					createdAt: new Date(),
					updatedAt: new Date(),
				};
	// Convert the JSON object to a buffer and send it to blockchain for storage
			let dataBuffer = Buffer.from(JSON.stringify(PropertyObject));
			await ctx.stub.putState(propertyKey, dataBuffer);
	// Return value of new property object
			return PropertyObject;
		}
		else{
			throw new Error('The user is not registererd on the network');
			}
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

		 /**
	 	 * Update Property status
	 	 * @param ctx
	 	 * @param propertyID - Identifer of real world property
	 	 * @param name -  property owner Name
	 	 * @param aadharId -  property owner aadhar
		 * @param propertyStatus -  property's status
	 	 * @returns {Property Object}
	 	 */
  async updateProperty(ctx, PropertyID, name, aadharId, propertyStatus){

		const userKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users', [name, aadharid]);

		let userBuffer = await ctx.stub
			.getState(userKey)
			.catch(err => console.log(err));

			let user=JSON.parse(dataBuffer.toString());

			if(user.flag==='Approved'){

			 const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.property',[PropertyID]);

			 // Return value of property from blockchain
			 let PropertyBuffer = await ctx.stub
					 .getState(propertyKey)
					 .catch(err => console.log(err));

			 let property=JSON.parse(PropertyBuffer.toString());

					if(property.owner===name+'-'+aadharId){

						property.status=propertyStatus;
						property.updatedAt=new Date();

						let dataBuffer = Buffer.from(JSON.stringify(property));
						await ctx.stub.putState(propertyKey, dataBuffer);
				// Return value of property Object
						return property;
					 }
					 else { throw new Error('The user is not the owner of the property');}
			}
			else{ throw new Error('The user is not registered on the network');}
		}

		/**
		* Purchase property function
	  * @param ctx
	  * @param propertyID - Identifer of real world property
	  * @param buyer_name - Buyer's name who wants to purchase the prop
	  * @param buyer_aadharId -  aadhar ID of buyer_name
	  * @returns {Property Object}
	  */

		async purchaseProperty(ctx, PropertyID, buyer_name, buyer_aadharId){

			const userKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users', [buyer_name, buyer_aadharId]);
			const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.property', [PropertyID]);

			let userBuffer = await ctx.stub
				.getState(userKey)
				.catch(err => console.log(err));

				let Buyer=JSON.parse(userBuffer.toString());

				if(Buyer.flag==='Approved'){

					let PropertyBuffer = await ctx.stub
							.getState(propertyKey)
							.catch(err => console.log(err));

					let property=JSON.parse(PropertyBuffer.toString());

					if(property.owner===buyer_name+'-'+buyer_aadharId){
						throw new Error('Invalid Request')
					}

					if(property.status==='onSale'&& property.Price<Buyer.upgradCoins){

								let key=property.owner.split('-');

								const sellerKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users', [key[0], key[1]);

								let SellerBuffer = await ctx.stub
										.getState(sellerKey)
										.catch(err => console.log(err));
								let seller=JSON.parse(SellerBuffer.toString());
								//update buyer Object
								Buyer.upgradCoins=parseInt(Buyer.upgradCoins)-parseInt(property.Price);
								Buyer.updatedAt=new Date();
								//update property Object
								property.owner=buyer_name+'-'+buyer_aadharId;
								property.status='registered';
								property.updatedAt=new Date();
								//update seller Details
								seller.upgradCoins=parseInt(seller.upgradCoins)+parseInt(property.Price);
								seller.updatedAt=new Date();


		// Convert the JSON object to a buffer and send it to blockchain for storage
							let propertyBuffer = Buffer.from(JSON.stringify(property));
							await ctx.stub.putState(propertyKey, propertyBuffer);

							let SellBufferdata = Buffer.from(JSON.stringify(seller));
							await ctx.stub.putState(sellerKey, SellBufferdata);

							let BuyerBufferdata=Buffer.from(JSON.stringify(Buyer));
							await ctx.stub.putState(userKey, BuyerBufferdata);
						}
				else{
				throw new Error('Either the property is not onSale or the buyer does not have sufficient balance to buy the property');}
		}
		else{throw new Error('The Buyer is not registered on the network');}
	}
}

module.exports = UserContract;
