--Nabil Ahmed
--ID: 25364170
-- Assignment 2
-- This file is the only file that has been modified for the assignment
-- This file implements the playCard and makeBid function 
-- There are a few other functions that has been implemented to assist the working of the playCard and makeBid


module Player (
    playCard,
    makeBid
)
where

{-
													~OH Hell The Card Game~
Assuming there are 19 rounds for one complete match the number of cards at hand would range from 12 to 3 and then back to 12

**********************************************************************************************************************************************

											The Strategy for Make Bid is as follows:

1. Check the deck that we have in our hand 
2. Check the trump suit

	NumberOfBids = 0

	If we have more than two cards in hand from the trump suit:
		Do 
		NumberOfBids = Total (Number of Cards from the Trump Suit) - 2

	Now, we create an empty List that will store any King or Ace from any Suits
	Ace_King_List = []     -- Initially List is empty

	If we have a King or Ace from any suit in our Hand We append them in this list 
		Ace_King_List.append[King/Ace..Suit]

	Then the length of the Ace_King_List is calculated
	So, then our NumberOfBids is calculated as:
		NumberOfBids = Total (Number of Cards from the Trump Suit) - 2
												
										+

						Length of the Ace_King_List
	

**********************************************************************************************************************************************


											Attempted Strategy for the PlayCard Function:

The lead player will play the card. The player must follow suit of the card that is played. If the does not have the card from the 
given suit only then he can play card from the trump suit or from other suit.

If the player is not the lead player:
	player will see the likely chances of him to win a bid:
		he does this by checking the cards in the table and the cards he has at his hands
			if he can certainly win that round he will check the bid number
				if he has already reached his bid amount he will purposefully lost that hand and all the consequtive hands
				else:
					he will keep on winning untill the upper condition is true
	
If the player is the lead player he will play the smallest card from his hand

**********************************************************************************************************************************************
P.S: This strategy was not gracefully implemented as it was giving errors. However, the strategy implemented 
has been given,documented and explained properly just before the function is initialized in the code below.

-}


import OhTypes
import OhHell
{-
-- Play a card for the current trick.
-- If you are the lead player then play the last card from your list of cards
-- If you are not the lead player then these 3 conditions can arise
-- 1. You can have the cards from suit that is being played 
-- 2. You don't have the card from the suit but you have a card from the trump suit
-- 3. You don't have any cards either from the trump suit or from the suit that is being played in your hand
-- If condition 1 is true: 
-- 		Play the highest card of that suit from your hand
-- If condition 2 is true: 
-- 		Play the highest card of the trump suit from your hand
-- If condition 3 is true: 
-- 		Play the first card from your hand

-}
playCard :: PlayFunc
playCard _ listofCards _ (Card trump_suit trump_rank) _ cardsInCurrentTrick
	|	not isLeadPlayer && hasLeadSuit = last $ sortDeck leadSuit (getCardwithSuit leadSuit listofCards)
	|	not isLeadPlayer && hasTrumpSuit = last $ sortDeck trumpSuit (getCardwithSuit trumpSuit listofCards)
	|	isLeadPlayer = last listofCards
	|	otherwise = head listofCards
	where 
		isLeadPlayer = length cardsInCurrentTrick > 0
		leadSuit = getLeadSuit cardsInCurrentTrick
		trumpSuit = trump_suit
		hasTrumpSuit = hasSuit trumpSuit listofCards
		hasLeadSuit = hasSuit leadSuit listofCards

-- hasSuit function checks if players list of cards has cards from that specific suit
hasSuit :: [Cards] -> Suit -> Bool
hasSuit [] _ = False
hasSuit ((Card suit rank):xs) s 
	| suit == s = True
	| suit /= s = hasSuit xs s 

-- If the current player is lead player then first card from the list of cards is lead suit
-- If current player is not lead player, then it returns the suit of lead player
getLeadSuit :: [Cards] -> [Card]-> Suit
getLeadSuit [] ((Card lead_suit lead_rank):xs) = lead_suit
getLeadSuit ((Card lead_suit lead_rank):xs)  t = lead_suit  

-- Bid the number of cards you can win based on the trump card and your hand.
-- last player to bid must obey "hook rule":
-- sum of bids must not equal number of tricks available
makeBid :: BidFunc -> Int
makeBid trump_card listofCards numberofPlayers listOfBids
	|	isLastPlayer && sumofBids + bidAmount == length listofCards && bidAmount == 0 = bidAmount + 1
	|	isLastPlayer && sumofBids + bidAmount == length listofCards && bidAmount > 0 = bidAmount - 1
	|	otherwise = bidAmount
			where 
				bidAmount = idealBidAmount (findAllTrumpCards  trump_card listofCards []) (findAllHighCards (Card Spade Ace) (Card Spade King) listofCards [])
				sumofBids = sum listOfBids
				isLastPlayer = length listOfBids == numberofPlayers - 1

-- Calculates the Bid Amount
-- Total Number of High card (king & ace) + (Total trumps cards in my hand - 2)
idealBidAmount :: [Card] -> [Card] -> Int
idealBidAmount trump_cards high_card = (findTrumpBidAmount trump_cards) + (length high_card)

-- Calculating the total trump bid amount
findTrumpBidAmount :: [Card] -> Int
findTrumpBidAmount trump_cards
				| (length trump_cards) > 2 = (length trump_cards) - 2
				| otherwise = 0

-- Finds all trump cards from the list of cards
findAllTrumpCards :: Card -> [Card] -> [Card] -> [Card]
findAllTrumpCards trump@(Card t_suit t_rank) (my_trump@(Card suit rank) :xs) curr 
				|  t_suit == suit = findAllTrumpCards trump xs (my_trump:curr)
				|  t_suit /= suit = findAllTrumpCards trump xs curr

--Finds all the King and Ace cards from the list of cards 
findAllHighCards :: Card -> Card -> [Card] -> [Card] -> [Card]
findAllHighCards ace@(Card ace_suit ace_rank) king@(Card king_suit king_rank) (my_ace_or_king@(Card suit rank) :xs) curr 
				|  ace_suit == suit = findAllHighCards ace king xs (my_ace_or_king:curr)
				|  king_suit == suit = findAllHighCards ace king xs (my_ace_or_king:curr)
				|  otherwise = findAllHighCards ace king xs curr
