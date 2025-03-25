// src/layout/templates.tsx
import { html } from "hono/html";
import type { FC } from "hono/jsx";
import { formatDate, timeAgo } from "../utils";

const Header: FC = (props) => {
	return (
		<header className="bg-neutral-50 border-b border-neutral-200 shadow-sm sticky top-0 z-10">
			<div className="container mx-auto max-w-4xl px-4">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						<a href="/" className="flex items-center space-x-2 text-xl font-semibold text-primary-700">
							<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
								<line x1="12" y1="11" x2="12" y2="17" />
								<line x1="9" y1="14" x2="15" y2="14" />
							</svg>
							<span>EduSynthesis</span>
						</a>
					</div>
					<div className="flex items-center">
						<div className="flex items-center space-x-2 bg-neutral-100 px-3 py-2 rounded-lg">
							{props.user ? (
								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
										{props.user.charAt(0).toUpperCase()}
									</div>
									<span className="font-medium">{props.user}</span>
								</div>
							) : (
								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											viewBox="0 0 16 16"
										>
											<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
											<path
												fill-rule="evenodd"
												d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
											/>
										</svg>
									</div>
									<span className="font-medium">Educator</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

const Footer: FC = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-neutral-100 border-t border-neutral-200">
			<div className="container mx-auto max-w-4xl px-4 py-6">
				<div className="flex flex-col md:flex-row md:justify-between md:items-center">
					<div className="text-center md:text-left mb-4 md:mb-0">
						<p className="text-neutral-600 text-sm">
							Copyright © {currentYear} EduSynthesis. All rights reserved.
						</p>
					</div>

					<div className="flex flex-col md:flex-row items-center gap-4">
						<nav className="flex flex-wrap justify-center md:justify-start gap-4 md:mr-6">
							<a href="/" className="text-neutral-600 hover:text-primary-700 transition-colors text-sm">
								Home
							</a>
							<a href="/create" className="text-neutral-600 hover:text-primary-700 transition-colors text-sm">
								Create Content
							</a>
						</nav>
					</div>
				</div>
			</div>
		</footer>
	);
};

export const Layout: FC = (props) => {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link href="/styles.css" rel="stylesheet" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />

				<title>{props.title || "EduSynthesis - AI-Powered Educational Content Generator"}</title>
				<meta name="title" content="EduSynthesis - AI-Powered Educational Content Generator" />
				<meta name="description" content="Create professional, evidence-based educational content tailored for educators, administrators, and education professionals." />

				<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230284c7'%3E%3Cpath d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'/%3E%3Cline x1='12' y1='11' x2='12' y2='17'/%3E%3Cline x1='9' y1='14' x2='15' y2='14'/%3E%3C/svg%3E" />
			</head>
			<body className="bg-neutral-50 min-h-screen flex flex-col">
				<Header user={props.user} />
				<main className="flex-grow py-6">
					{props.children}
				</main>
				<Footer />
			</body>
		</html>
	);
};

export const ContentList: FC = (props) => {
	return (
		<div className="container mx-auto max-w-4xl px-4">
			<div className="bg-white shadow-md rounded-xl overflow-hidden">
				<div className="p-4 md:p-6 lg:p-8">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
						<h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
							Educational Content Library
						</h2>
						<div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
							<a
								href="/create"
								className="btn btn-primary flex items-center justify-center gap-2 px-3 py-2 text-sm md:text-base rounded-lg"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									className="w-4 h-4 md:w-5 md:h-5"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
								</svg>
								<span>Create New Content</span>
							</a>
						</div>
					</div>

					<div className="overflow-x-auto -mx-4 sm:-mx-6">
						<table className="w-full">
							<thead>
								<tr className="border-b border-neutral-200">
									<th className="px-4 sm:px-6 py-3 text-left font-medium text-neutral-500 text-xs sm:text-sm tracking-wider">Topic</th>
									<th className="px-4 sm:px-6 py-3 text-left font-medium text-neutral-500 text-xs sm:text-sm tracking-wider">Audience</th>
									<th className="px-4 sm:px-6 py-3 text-left font-medium text-neutral-500 text-xs sm:text-sm tracking-wider">Status</th>
									<th className="px-4 sm:px-6 py-3 text-left font-medium text-neutral-500 text-xs sm:text-sm tracking-wider whitespace-nowrap">Created</th>
									<th className="px-4 sm:px-6 py-3 text-right font-medium text-neutral-500 text-xs sm:text-sm tracking-wider">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-neutral-200">
								{(props.content || []).map((item) => (
									<tr key={item.id} className="hover:bg-neutral-50 transition-colors duration-150">
										<td className="px-4 sm:px-6 py-3 sm:py-4">
											<div className="text-xs sm:text-sm text-neutral-800 line-clamp-2">{item.topic}</div>
										</td>
										<td className="px-4 sm:px-6 py-3 sm:py-4">
											<div className="text-xs sm:text-sm text-neutral-800">{item.audience}</div>
										</td>
										<td className="px-4 sm:px-6 py-3 sm:py-4">
											<span
												className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 1
													? "bg-amber-100 text-amber-800"
													: item.status === 2
														? "bg-emerald-100 text-emerald-800"
														: "bg-red-100 text-red-800"
													}`}
											>
												{item.status === 1 ? (
													<>
														<svg className="mr-1 h-2 w-2 text-amber-400 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
															<circle cx="4" cy="4" r="3" />
														</svg>
														Processing
													</>
												) : item.status === 2 ? (
													<>
														<svg className="mr-1 h-2 w-2 text-emerald-500" fill="currentColor" viewBox="0 0 8 8">
															<circle cx="4" cy="4" r="3" />
														</svg>
														Complete
													</>
												) : (
													<>
														<svg className="mr-1 h-2 w-2 text-red-500" fill="currentColor" viewBox="0 0 8 8">
															<circle cx="4" cy="4" r="3" />
														</svg>
														Error
													</>
												)}
											</span>
										</td>
										<td className="px-4 sm:px-6 py-3 sm:py-4">
											<span className="text-xs sm:text-sm text-neutral-500 whitespace-nowrap">
												{item.created_at ? timeAgo(new Date(item.created_at)) : ''}
											</span>
										</td>
										<td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
											<a
												href={"/content/" + item.id}
												className="inline-flex justify-center items-center px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors text-xs md:text-sm font-medium w-full sm:w-auto"
											>
												{item.status === 1 ? "View" : "Read"}
											</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{!props.content || props.content.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-10 px-4 sm:px-6">
								<div className="bg-neutral-100 rounded-full p-3 sm:p-4 mb-3 sm:mb-4">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
									</svg>
								</div>
								<h3 className="text-base sm:text-lg font-medium text-neutral-900 mb-1">No educational content yet</h3>
								<p className="text-neutral-500 text-center text-sm sm:text-base mb-4 sm:mb-6">Start by creating your first educational content</p>
								<a
									href="/create"
									className="btn btn-primary inline-flex justify-center items-center gap-2 px-4 py-2 text-sm md:text-base rounded-lg"
								>
									Create Content
								</a>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
};

export const CreateContent: FC = (props) => {
	const defaultTopic = props?.formData?.topic || "";
	const defaultAudience = props?.formData?.audience || "Teachers and educators";
	const defaultFormat = props?.formData?.format || "Article";
	const defaultAdditionalInstructions = props?.formData?.additionalInstructions || "";

	return (
		<div className="container mx-auto max-w-4xl px-4">
			<div className="bg-white shadow-md rounded-xl overflow-hidden">
				<div className="p-6 md:p-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-neutral-900">
							Create Educational Content
						</h2>
						<a href="/" className="btn btn-outline btn-sm flex items-center space-x-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path
									fill-rule="evenodd"
									d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
								/>
							</svg>
							<span>Back</span>
						</a>
					</div>

					<div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg shadow-sm">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
								</svg>
							</div>
							<div className="ml-3">
								<h3 className="text-sm font-medium text-blue-800">About This Tool</h3>
								<div className="mt-2 text-sm text-blue-700">
									<p>EduSynthesis helps you create evidence-based educational content tailored for educators. Our AI-powered platform researches the topic, synthesizes the information, and creates content in your preferred format.</p>
								</div>
							</div>
						</div>
					</div>

					<form
						className="space-y-6 max-w-2xl"
						action="/create"
						method="post"
					>
						<div className="space-y-2">
							<label className="block text-sm font-medium text-neutral-700">
								Educational Topic *
							</label>
							<div className="relative">
								<textarea
									id="topic"
									name="topic"
									className="w-full min-h-32 p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
									required={true}
									placeholder="E.g., Implementing project-based learning in high school science classes or Effective strategies for supporting English language learners in elementary classrooms"
									defaultValue={defaultTopic}
								></textarea>
							</div>
							<div className="text-xs text-neutral-500">
								Describe the educational topic you want content created for. Be as specific as possible.
							</div>
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-neutral-700">
								Target Audience *
							</label>
							<input
								name="audience"
								type="text"
								className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
								defaultValue={defaultAudience}
								placeholder="E.g., K-12 teachers, School principals, Special education specialists"
								required={true}
							/>
							<div className="text-xs text-neutral-500">
								Specify who this educational content is for. This helps tailor the content to their needs.
							</div>
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-neutral-700">
								Content Format *
							</label>
							<select
								name="format"
								className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
								defaultValue={defaultFormat}
								required={true}
							>
								<option value="Article">Article</option>
								<option value="Lesson Plan">Lesson Plan</option>
								<option value="Resource Guide">Resource Guide</option>
								<option value="Professional Development">Professional Development</option>
								<option value="Implementation Framework">Implementation Framework</option>
								<option value="Best Practices Guide">Best Practices Guide</option>
								<option value="Research Summary">Research Summary</option>
							</select>
							<div className="text-xs text-neutral-500">
								Select the format that best suits your educational content needs.
							</div>
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-neutral-700">
								Additional Instructions (Optional)
							</label>
							<textarea
								name="additionalInstructions"
								className="w-full min-h-20 p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
								placeholder="Any specific requirements, focus areas, or elements you'd like included in the content."
								defaultValue={defaultAdditionalInstructions}
							></textarea>
							<div className="text-xs text-neutral-500">
								Add any specific requirements or elements you'd like included in your educational content.
							</div>
						</div>

						<div className="pt-4">
							<button className="btn btn-primary w-full md:w-auto">
								Continue
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export const ContentQuestions: FC = (props) => {
	return (
		<div className="container mx-auto max-w-4xl px-4">
			<div className="bg-white shadow-md rounded-xl overflow-hidden">
				<div className="p-6 md:p-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-neutral-900">
							Refine Your Content Request
						</h2>
						<a href="/" className="btn btn-outline btn-sm flex items-center space-x-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path
									fill-rule="evenodd"
									d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
								/>
							</svg>
							<span>Back</span>
						</a>
					</div>

					<div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
						<div className="text-sm font-medium text-primary-800 mb-1">Your Content Request:</div>
						<p className="text-primary-900 font-medium">{props.contentRequest.topic}</p>
						<div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
							<div>
								<span className="text-primary-700">Audience:</span> {props.contentRequest.audience}
							</div>
							<div>
								<span className="text-primary-700">Format:</span> {props.contentRequest.format}
							</div>
						</div>
					</div>

					<div className="max-w-2xl">
						<div className="mb-6">
							<h3 className="text-lg font-medium text-neutral-800 mb-2">
								Refine Your Request
							</h3>
							<p className="text-neutral-600 text-sm mb-4">
								To create the most valuable educational content, please answer these follow-up questions. They will help us understand your specific needs.
							</p>
							<button
								type="button"
								id="prefill-all-btn"
								className="text-sm font-medium bg-primary-100 text-primary-800 hover:bg-primary-200 px-3 py-2 rounded-md flex items-center transition-colors cursor-pointer"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
									<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
								</svg>
								Generate AI-Suggested Answers
							</button>
							<div id="all-suggestions-status" className="mt-2 text-sm text-neutral-600 hidden">
								<div className="flex items-center">
									<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Generating AI suggestions...
								</div>
							</div>
						</div>

						<form action="/create/finish" method="post" className="space-y-6" id="content-questions-form">
							<input name="topic" value={props.contentRequest.topic} type="hidden" />
							<input name="audience" value={props.contentRequest.audience} type="hidden" />
							<input name="format" value={props.contentRequest.format} type="hidden" />
							<input name="additionalInstructions" value={props.contentRequest.additionalInstructions || ""} type="hidden" />

							{props.questions.map((question, index) => (
								<div className="space-y-2" key={index}>
									<label className="block text-sm font-medium text-neutral-700" id={`question-${index}-label`}>
										{index + 1}. {question}
									</label>
									{/* Changed to use indexed form field names */}
									<input name={`question[${index}]`} value={question} type="hidden" />
									<div className="relative">
										<textarea
											id={`answer-${index}`}
											name={`answer[${index}]`}
											className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
											required
											placeholder="Your answer..."
											rows={3}
										></textarea>
										<button
											type="button"
											className="suggest-btn bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors border border-primary-200 absolute right-2 top-2 rounded px-2 py-1 text-sm flex items-center cursor-pointer"
											data-index={index}
										>
											<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clipRule="evenodd" />
												<path fillRule="evenodd" d="M5 11a5 5 0 1110 0 5 5 0 01-10 0zm5-3a3 3 0 100 6 3 3 0 000-6z" clipRule="evenodd" />
											</svg>
											<span>Suggest Answer</span>
											<span className="loading-indicator hidden ml-1">
												<svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
													<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
													<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
												</svg>
											</span>
										</button>
									</div>
									<div className="suggestion-status text-xs text-neutral-500 hidden">
										<span className="flex items-center text-green-600">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
											</svg>
											AI-generated answer applied
										</span>
									</div>
								</div>
							))}

							<div className="pt-2">
								<button className="btn btn-primary w-full md:w-auto">
									Create Educational Content
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			<script dangerouslySetInnerHTML={{
				__html: `
			document.addEventListener('DOMContentLoaded', () => {
			  const form = document.getElementById('content-questions-form');
			  const contentTopic = document.querySelector('input[name="topic"]').value;
			  const suggestAllBtn = document.getElementById('prefill-all-btn');
			  const allSuggestionsStatus = document.getElementById('all-suggestions-status');
			  
			  // Function to get an AI suggestion for a question
			  async function getAISuggestion(question, index) {
				try {
				  const contentTopic = document.querySelector('input[name="topic"]').value;
				  
				  // Show loading indication in the UI before making the API call
				  
				  // Make an actual API call to get AI-generated suggestion
				  const response = await fetch('/api/suggest-answer', {
					method: 'POST',
					headers: {
					  'Content-Type': 'application/json',
					},
					body: JSON.stringify({
					  question: question,
					  topic: contentTopic
					}),
				  });
				  
				  if (!response.ok) {
					throw new Error(\`API error: \${response.status}\`);
				  }
				  
				  const data = await response.json();
				  
				  if (data.error) {
					throw new Error(data.error);
				  }
				  
				  return data.answer;
				} catch (error) {
				  console.error('Error getting suggestion:', error);
				  return "Unable to generate an AI suggestion at this time. Please try again or enter your own response.";
				}
			  }
			  
			  // Handle individual suggestion buttons
			  document.querySelectorAll('.suggest-btn').forEach(button => {
				button.addEventListener('click', async function() {
				  // Get elements
				  const index = this.getAttribute('data-index');
				  const questionElement = document.getElementById(\`question-\${index}-label\`);
				  const textareaElement = document.getElementById(\`answer-\${index}\`);
				  const loadingIndicator = this.querySelector('.loading-indicator');
				  const statusElement = this.closest('.space-y-2').querySelector('.suggestion-status');
				  
				  if (!questionElement || !textareaElement) return;
				  
				  // Get question text (remove the number prefix)
				  const questionText = questionElement.textContent.trim();
				  const questionWithoutNumber = questionText.substring(questionText.indexOf('. ') + 2);
				  
				  // Show loading state
				  this.disabled = true;
				  loadingIndicator.classList.remove('hidden');
				  
				  // Get AI suggestion
				  const suggestion = await getAISuggestion(questionWithoutNumber, index);
				  
				  // Update UI
				  if (suggestion) {
					textareaElement.value = suggestion;
					statusElement.classList.remove('hidden');
				  }
				  
				  // Reset button state
				  this.disabled = false;
				  loadingIndicator.classList.add('hidden');
				});
			  });
			  
			  // Handle "Generate All Answers" button
			  suggestAllBtn.addEventListener('click', async function() {
				try {
				  // Show loading state
				  this.disabled = true;
				  allSuggestionsStatus.classList.remove('hidden');
				  
				  // Get all question elements
				  const questionElements = document.querySelectorAll('[id^="question-"][id$="-label"]');
				  
				  // Process each question sequentially
				  for (let i = 0; i < questionElements.length; i++) {
					// Update status message to show which question is being processed
					allSuggestionsStatus.innerHTML = \`<div class="flex items-center">
					  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					  </svg>
					  Generating answer for question \${i+1} of \${questionElements.length}...
					</div>\`;
					
					const questionElement = questionElements[i];
					const index = questionElement.id.replace('question-', '').replace('-label', '');
					const textareaElement = document.getElementById(\`answer-\${index}\`);
					const statusElement = textareaElement.closest('.space-y-2').querySelector('.suggestion-status');
					
					// Get question text (remove the number prefix)
					const questionText = questionElement.textContent.trim();
					const questionWithoutNumber = questionText.substring(questionText.indexOf('. ') + 2);
					
					// Get AI suggestion - real API call
					try {
					  const suggestion = await getAISuggestion(questionWithoutNumber, index);
					  
					  // Update UI
					  if (suggestion) {
						textareaElement.value = suggestion;
						statusElement.classList.remove('hidden');
					  }
					} catch (error) {
					  console.error(\`Error generating answer for question \${i+1}:\`, error);
					  // Continue with the next question even if one fails
					}
				  }
				  
				  // Success state
				  allSuggestionsStatus.innerHTML = '<span class="flex items-center text-green-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>All answers generated</span>';
				} catch (error) {
				  // Error state
				  console.error('Error generating all answers:', error);
				  allSuggestionsStatus.innerHTML = \`<span class="flex items-center text-red-600">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
					  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
					</svg>
					Error generating answers: \${error.message || 'Unknown error'}
				  </span>\`;
				} finally {
				  // Always re-enable the button
				  this.disabled = false;
				}
			  });
			});
		  `
			}}></script>
		</div>
	);
};

export const ContentDetails: FC = (props) => {
	return (
		<div className="container mx-auto max-w-4xl px-4">
			<div className="bg-white shadow-md rounded-xl overflow-hidden">
				<div className="p-6 md:p-8">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-medium text-neutral-500">
							Educational Content
						</h3>
						<div className="flex items-center gap-2">
							<a href="/" className="btn btn-outline btn-sm flex items-center space-x-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 16 16"
								>
									<path
										fill-rule="evenodd"
										d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
									/>
								</svg>
								<span>Back</span>
							</a>
						</div>
					</div>

					<div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg className="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-sm text-amber-700">
									This content was generated by AI based on educational research. Always review and adapt content to your specific educational context.
								</p>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2 mb-6">
						<h2 className="text-2xl font-bold text-neutral-900">{props.content.topic}</h2>
					</div>

					<div className="space-y-6">
						<div className="border border-neutral-200 rounded-lg overflow-hidden">
							<div className="flex items-center px-4 py-3 bg-neutral-50 border-b border-neutral-200">
								<button className="flex items-center justify-between w-full text-left">
									<span className="font-medium text-neutral-800">Content Parameters</span>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<polyline points="6 9 12 15 18 9"></polyline>
									</svg>
								</button>
							</div>

							<div className="p-4 bg-white">
								<table className="w-full text-sm">
									<tbody>
										<tr className="border-b border-neutral-100">
											<th className="py-2 pr-4 font-medium text-neutral-700 text-left">Audience</th>
											<td className="py-2 text-neutral-900">{props.content.audience}</td>
										</tr>
										<tr className="border-b border-neutral-100">
											<th className="py-2 pr-4 font-medium text-neutral-700 text-left">Format</th>
											<td className="py-2 text-neutral-900">{props.content.format}</td>
										</tr>
										{props.content.additional_instructions && (
											<tr>
												<th className="py-2 pr-4 font-medium text-neutral-700 text-left">Additional Instructions</th>
												<td className="py-2 text-neutral-900">{props.content.additional_instructions}</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>

						<div className="border border-neutral-200 rounded-lg overflow-hidden">
							<div className="flex items-center px-4 py-3 bg-neutral-50 border-b border-neutral-200">
								<button className="flex items-center justify-between w-full text-left">
									<span className="font-medium text-neutral-800">Clarification Questions</span>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<polyline points="6 9 12 15 18 9"></polyline>
									</svg>
								</button>
							</div>

							<div className="divide-y divide-neutral-100">
								{props.content.questions.map((obj) => (
									<div className="p-4 bg-white" key={obj.question.substring(0, 20)}>
										<div className="font-medium text-neutral-800 mb-1">{obj.question}</div>
										<div className="text-sm text-neutral-600">{obj.answer}</div>
									</div>
								))}
							</div>
						</div>

						<div className="border border-neutral-200 rounded-lg overflow-hidden">
							<div className="flex items-center px-4 py-3 bg-neutral-50 border-b border-neutral-200">
								<div className="flex items-center justify-between w-full">
									<span className="font-medium text-neutral-800">Generated Content</span>
									{props.content.status === 1 && (
										<div className="flex items-center text-amber-600 text-sm">
											<svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Processing...
										</div>
									)}
								</div>
							</div>

							<div className="p-6 bg-white">
								{/* KEY CHANGE: Conditionally render content based on status */}
								{props.content.status === 1 ? (
									<div dangerouslySetInnerHTML={{ __html: props.content.content_html }}></div>
								) : (
									<div className="article prose max-w-none">{html(props.content.content_html)}</div>
								)}

								<div className="mt-8 pt-6 border-t border-neutral-200">
									<div className="flex items-center justify-between">
										<span className="text-sm text-neutral-500">
											{props.content.created_at ? formatDate(new Date(props.content.created_at)) : ''}
										</span>

										<div className="flex space-x-2">
											<button
												id="copyBtn"
												className="btn btn-outline btn-sm flex items-center gap-1"
												onclick="copyContent()"
											>
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
													<path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
													<path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
												</svg>
												<span>Copy</span>
											</button>

											<button
												id="printBtn"
												className="btn btn-outline btn-sm flex items-center gap-1"
												onclick="window.print()"
											>
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
												</svg>
												<span>Print</span>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<script dangerouslySetInnerHTML={{
				__html: `
			function copyContent() {
			  const content = document.querySelector('.article')?.innerText || document.querySelector('.prose')?.innerText || '';
			  navigator.clipboard.writeText(content).then(() => {
				const copyBtn = document.getElementById('copyBtn');
				if (!copyBtn) return;
				
				const originalText = copyBtn.innerHTML;
				
				copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg><span>Copied!</span>';
				
				setTimeout(() => {
				  copyBtn.innerHTML = originalText;
				}, 2000);
			  }).catch(err => {
				console.error('Failed to copy: ', err);
			  });
			}
			
			// Make all source links open in new tabs
			document.addEventListener('DOMContentLoaded', () => {
			  // Target all links under the sources section
			  const sourcesHeading = Array.from(document.querySelectorAll('.article h2, .article h3')).find(h => 
				h.textContent?.toLowerCase().includes('sources') || 
				h.textContent?.toLowerCase().includes('references'));
				
			  if (sourcesHeading) {
				// Get all links after the sources heading
				const sourcesList = sourcesHeading.nextElementSibling;
				if (sourcesList && (sourcesList.tagName === 'OL' || sourcesList.tagName === 'UL')) {
				  const links = sourcesList.querySelectorAll('a');
				  links.forEach(link => {
					link.setAttribute('target', '_blank');
					link.setAttribute('rel', 'noopener noreferrer');
				  });
				} else {
				  // Look for links in paragraphs after the heading
				  let currentElement = sourcesHeading.nextElementSibling;
				  while (currentElement && 
						!(currentElement.tagName === 'H2' || currentElement.tagName === 'H3')) {
					const links = currentElement.querySelectorAll('a');
					links.forEach(link => {
					  link.setAttribute('target', '_blank');
					  link.setAttribute('rel', 'noopener noreferrer');
					});
					currentElement = currentElement.nextElementSibling;
				  }
				}
			  }
			});
		  `
			}}></script>
		</div>
	);
};

export const ValidationErrorDisplay: FC = (props) => {
	return (
		<div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
			<div className="flex">
				<div className="flex-shrink-0">
					<svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
						<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
					</svg>
				</div>
				<div className="ml-3">
					<h3 className="text-sm font-medium text-red-800">Validation Error</h3>
					<div className="mt-2 text-sm text-red-700">
						<ul className="list-disc pl-5 space-y-1">
							{props.errors.map((error, index) => (
								<li key={index}>{error}</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};