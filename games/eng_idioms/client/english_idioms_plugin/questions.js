imgPath = "/assets/idioms/questions/";

function Answer(text, imgName) {
	this.text = text;
	this.imgName = imgPath + imgName;
}

function Question(id, text, answers, rightAnswer, answerExplanation, answeredAnswer) {
	this.id = id;
	this.text = text;
	this.answers = answers;
	this.rightAnswer = rightAnswer;
	if (answerExplanation === undefined)
		answerExplanation = "";
	this.answerExplanation = answerExplanation;
	if (answeredAnswer === undefined)
		answeredAnswer = 1;
	this.answeredAnswer = answeredAnswer;
}

QUESTIONS_LIST = [
	new Question("1", "I went scuba-diving for the first time last summer. \n\
I thought it was going to be a ..., \n\
but I soon realized that it was a lot more difficult than I'd expected.",
		[
			new Answer("Mug of beer.", "mug-of-beer.jpg"),
			new Answer("Cup of tea.", "cup-of-tea.jpg"),
			new Answer("Piece of cake.", "piece-of-cake.png"),
			new Answer("Can of coke.", "can-of-coke.jpg")
		], 3),
	new Question("2", "Any accountant worth their ... should be aware of the latest changes in taxation.",
		[
			new Answer("Salt.", "salt.png"),
			new Answer("Spice.", "spice.png"),
			new Answer("Pepper.", "pepper.png"),
			new Answer("Butter.", "butter.png")
		], 1),
	new Question("3", "Her attitude to the whole thing drives me crazy! It really ... me off!",
		[
			new Answer("Ices.", "ices.png"),
			new Answer("Sausages.", "sausages.png"),
			new Answer("Butters.", "butter.png"),
			new Answer("Cheeses.", "cheese.png")
		], 4),
	new Question("4", "Most   of my colleagues go for a drink after work on  \n\
Fridays  but I don't normally go. Going  on  a pub crawl is  not my  ... .",
		[
			new Answer("Mug of beer.", "beer.png"),
			new Answer("Cup of tea.", "tea.png"),
			new Answer("Piece of cake.", "cake.png"),
			new Answer("Can of coke.", "coke.png")
		], 2),
	new Question("5", "He's a very good and honest person. He's the ... of the earth.",
		[
			new Answer("Pepper.", "pepper.png"),
			new Answer("Flavour.", "flavour.jpg"),
			new Answer("Salt.", "salt.png"),
			new Answer("Butter.", "butter.png")
		], 3),
	new Question("6", "Variety is the ... of life.",
		[
			new Answer("Butter.", "butter.png"),
			new Answer("Spice.", "spice.png" ),
			new Answer("Salt.", "salt.png"),
			new Answer("Pepper", "pepper.png")
		], 2),
	new Question("7", "How dare you say such nasty things about Stewart? He's the best thing since ... !",
		[
			new Answer("Strawberry jam.", "strawberry-jam.jpg"),
			new Answer("Home-made cakes.", "home-made-cakes.jpg"),
			new Answer("Cornflakes.", "cornflakes.jpg"),
			new Answer("Sliced bread.", "sliced-bread.jpg")
		], 4),
	new Question("8",
		"Did you see the way Lucy handled that angry customer? She was as cool as ... .",
		[
			new Answer("Ice-cream.", "ices.png"),
			new Answer("a frozen fish", "a-frozen-fish.jpg"),
			new Answer("Iced tea.", "tea.png"),
			new Answer("a cucumber.", "cucumber.png")
		], 4),
	new Question("9", "We'd planned to go away for the weekend, but my brother \n\
tripped over our cat on Saturday morning and broke his arm, and, naturally, it all went ... .",
		[
			new Answer("Carrot-shaped.", "carrot.png"),
			new Answer("Pear-shaped.", "pear.png"),
			new Answer("Egg-shaped.", "eggs.png"),
			new Answer("Apple-shaped.", "apple.png")
		], 2),
	new Question("10",
		"His new video game is apparently very good as it's selling like ... .",
		[
			new Answer("Hot dogs.", "hot-dogs.jpg"),
			new Answer("Hot cakes.", "cake.png"),
			new Answer("Hot chocolate.", "hot-chocolate.jpg"),
			new Answer("Hot ketchup.", "hot-ketchup.jpg")
		], 2)
];