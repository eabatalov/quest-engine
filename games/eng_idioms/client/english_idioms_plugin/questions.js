imgPath = "/assets/idioms/questions/";

function Answer(text) {
	this.text = text;
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
	new Question("1", "I went scuba-diving for the first time last summer. I thought it was going to be a ..., but I soon realized that it was a lot more difficult than I'd expected.",
		[
			new Answer("Mug of beer"),
			new Answer("Cup of tea"),
			new Answer("Piece of cake"),
			new Answer("Can of coke")
		], 3),
	new Question("2", "Any accountant worth their ... should be aware of the latest changes in taxation.",
		[
			new Answer("Salt"),
			new Answer("Spice"),
			new Answer("Pepper"),
			new Answer("Butter")
		], 1),
	new Question("3", "Her attitude to the whole thing drives me crazy! It really ... me off!",
		[
			new Answer("Ices."),
			new Answer("Sausages."),
			new Answer("Butters."),
			new Answer("Cheeses.")
		], 4),
	new Question("4", "Most   of my colleagues go for a drink after work on  \n\
Fridays  but I don't normally go. Going  on  a pub crawl is  not my  ... .",
		[
			new Answer("Mug of beer"),
			new Answer("Cup of tea"),
			new Answer("Piece of cake"),
			new Answer("Can of coke")
		], 2),
	new Question("5", "He's a very good and honest person. He's the ... of the earth.",
		[
			new Answer("Pepper"),
			new Answer("Flavour"),
			new Answer("Salt"),
			new Answer("Butter")
		], 3),
	new Question("6", "Variety is the ... of life.",
		[
			new Answer("Butter"),
			new Answer("Spice"),
			new Answer("Salt"),
			new Answer("Pepper")
		], 2),
	new Question("7", "How dare you say such nasty things about Stewart? He's the best thing since ... !",
		[
			new Answer("Strawberry jam"),
			new Answer("Home-made cakes"),
			new Answer("Cornflakes"),
			new Answer("Sliced bread")
		], 4),
	new Question("8",
		"Did you see the way Lucy handled that angry customer? She was as cool as ... .",
		[
			new Answer("Ice-cream"),
			new Answer("a frozen fish"),
			new Answer("Iced tea"),
			new Answer("a cucumber")
		], 4),
	new Question("9", "We'd planned to go away for the weekend, but my brother tripped over our cat on Saturday morning and broke his arm, and, naturally, it all went ... .",
		[
			new Answer("Carrot-shaped."),
			new Answer("Pear-shaped."),
			new Answer("Egg-shaped."),
			new Answer("Apple-shaped.")
		], 2),
	new Question("10",
		"His new video game is apparently very good as it's selling like ... .",
		[
			new Answer("Hot dogs"),
			new Answer("Hot cakes"),
			new Answer("Hot chocolate"),
			new Answer("Hot ketchup")
		], 2)
];