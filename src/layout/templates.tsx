import { html } from "hono/html";
import type { FC } from "hono/jsx";
import type { ResearchType } from "../types";
import { formatManilaTime } from "../utils";

const TopBar: FC = (props) => {
	return (
		<header className="bg-neutral-50 border-b border-neutral-200 shadow-sm sticky top-0 z-10">
			<div className="container mx-auto">
				<div className="flex items-center justify-between h-16 px-4">
					<div className="flex items-center">
						<a href="/" className="flex items-center space-x-2 text-xl font-semibold text-primary-700">
							<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
							</svg>
							<span>e-saliksik</span>
						</a>
					</div>
					<div className="flex items-center">
						<div className="relative">
							<div
								tabIndex={0}
								role="button"
								className="flex items-center space-x-2 bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200 px-3 py-2 rounded-lg cursor-pointer"
							>
								{props.user !== "unknown" ? (
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
										<span className="font-medium">Public</span>
									</div>
								)}
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
								</svg>
							</div>
							<div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 hidden group-focus:block">
								<ul className="py-2">
									<li>
										<a href="/auth/logout" className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
											</svg>
											Logout
										</a>
									</li>
								</ul>
							</div>
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
			<div className="container mx-auto py-6 px-4">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="mb-4 md:mb-0">
						<p className="text-neutral-600 text-sm">
							Copyright © {currentYear} Mark Anthony Llego. All rights reserved.
						</p>
					</div>
					<div className="flex items-center space-x-4">
						<a href="https://github.com/llegomark" className="text-neutral-600 hover:text-primary-700 transition-colors">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
								<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
							</svg>
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

// Inline SVG favicon that will be included directly in the HTML
// This ensures the favicon works without needing to reference external files
const InlineFavicon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0284c7" rx="64" />
  <g transform="translate(80, 80) scale(0.7)">
    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" fill="white"/>
    <path d="M240 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v60.8c-7.1 4.5-14 9.6-20.9 14.9-5.9-7.7-15.3-7.7-22.7-2.6s-8.9 13.1-3.6 20.2c24.9 33.3 24.9 29.4 44.1 51.8 6.2 7.1 14.3 6.8 21.5 1.1 7.2-5.7 8.5-13.8 4.6-22.1-13.9-25.3-14-24.8-23.4-37.6 20.3-15.2 40.8-22.6 61.5-25.4-.1 0-.1-61.1-.1-61.1z" fill="white"/>
  </g>
</svg>
`;

export const Layout: FC = (props) => {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link href="/styles.css" rel="stylesheet" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet" />

				{/* Inline SVG favicon - works without external assets */}
				<link rel="icon" href={`data:image/svg+xml;base64,${btoa(InlineFavicon)}`} type="image/svg+xml" />
				<link rel="icon" href="data:;base64,iVBORw0KGgo=" /> {/* Empty favicon fallback to prevent 404 */}

				{/* Primary Meta Tags */}
				<title>{props.title || "e-saliksik - Advanced AI Research Assistant"}</title>
				<meta name="title" content="e-saliksik - Advanced AI Research Assistant" />
				<meta name="description" content="A serverless, Cloudflare Workers-based Deep Research Agent powered by Google Gemini 2.0. Conduct in-depth research on any topic with AI assistance." />

				{/* Open Graph / Facebook */}
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://e-saliksik.llegomark.com/" />
				<meta property="og:title" content="e-saliksik - Advanced AI Research Assistant" />
				<meta property="og:description" content="A serverless, Cloudflare Workers-based Deep Research Agent powered by Google Gemini 2.0. Conduct in-depth research on any topic with AI assistance." />
				<meta property="og:image" content="https://e-saliksik.llegomark.com/social-preview.png" />

				{/* Twitter */}
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://e-saliksik.llegomark.com/" />
				<meta property="twitter:title" content="e-saliksik - Advanced AI Research Assistant" />
				<meta property="twitter:description" content="A serverless, Cloudflare Workers-based Deep Research Agent powered by Google Gemini 2.0. Conduct in-depth research on any topic with AI assistance." />
				<meta property="twitter:image" content="https://e-saliksik.llegomark.com/social-preview.png" />
			</head>
			<body className="bg-neutral-50 min-h-screen flex flex-col">
				<TopBar user={props.user} />
				<main className="flex-grow">
					<div className="container mx-auto p-4 md:p-6">{props.children}</div>
				</main>
				<Footer />
			</body>
		</html>
	);
};

export const ResearchList: FC = (props) => {
	return (
		<>
			<div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg shadow-sm">
				<div className="flex">
					<div className="flex-shrink-0">
						<svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
						</svg>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-blue-800">Public Research Repository</h3>
						<div className="mt-2 text-sm text-blue-700">
							<p>All research conducted on e-saliksik is publicly available and visible to all users. Please do not include sensitive or personal information in your research queries.</p>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg shadow-sm">
				<div className="flex">
					<div className="flex-shrink-0">
						<svg className="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
						</svg>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-amber-800">AI-Generated Content Disclaimer</h3>
						<div className="mt-2 text-sm text-amber-700">
							<p>Research reports are generated by AI and may contain errors or inaccuracies. Always verify important information from multiple sources before making decisions based on these reports.</p>
						</div>
					</div>
				</div>
			</div>

			<div className="card bg-white shadow-md rounded-xl overflow-hidden">
				<div className="p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-neutral-900">
							Community Research Archive
						</h2>
						<a href="/create" className="btn btn-success flex items-center space-x-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								className="w-5 h-5"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
							</svg>
							<span>New</span>
						</a>
					</div>

					<div className="overflow-x-auto -mx-6">
						<table className="w-full">
							<thead>
								<tr className="border-b border-neutral-200">
									<th className="px-6 py-3 text-left font-medium text-neutral-500 text-sm tracking-wider">Query</th>
									<th className="px-6 py-3 text-left font-medium text-neutral-500 text-sm tracking-wider">Status</th>
									<th className="px-6 py-3 text-left font-medium text-neutral-500 text-sm tracking-wider">Date Created</th>
									<th className="px-6 py-3 text-right font-medium text-neutral-500 text-sm tracking-wider">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-neutral-200">
								{(props.researches.results as ResearchType[]).map((obj) => (
									<tr className="hover:bg-neutral-50 transition-colors duration-150">
										<td className="px-6 py-4">
											<div className="text-sm text-neutral-800 line-clamp-2">{obj.query}</div>
										</td>
										<td className="px-6 py-4">
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obj.status === 1 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}
											>
												{obj.status === 1 ? (
													<>
														<svg className="mr-1.5 h-2 w-2 text-amber-400 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
															<circle cx="4" cy="4" r="3" />
														</svg>
														Running
													</>
												) : (
													<>
														<svg className="mr-1.5 h-2 w-2 text-emerald-500" fill="currentColor" viewBox="0 0 8 8">
															<circle cx="4" cy="4" r="3" />
														</svg>
														Complete
													</>
												)}
											</span>
										</td>
										<td className="px-6 py-4">
											<span className="text-sm text-neutral-500 whitespace-nowrap">
												{formatManilaTime(new Date(obj.created_at))}
											</span>
										</td>
										<td className="px-6 py-4 text-right">
											<a
												href={"/details/" + obj.id}
												className="inline-block text-center px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors text-sm font-medium w-full sm:w-auto"
											>
												{obj.status === 1 ? "View" : "Read"}
											</a>
										</td>

									</tr>
								))}
							</tbody>
						</table>
						{(props.researches.results as ResearchType[]).length === 0 && (
							<div className="flex flex-col items-center justify-center py-12 px-6">
								<div className="bg-neutral-100 rounded-full p-4 mb-4">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
									</svg>
								</div>
								<h3 className="text-lg font-medium text-neutral-900 mb-1">No researches yet</h3>
								<p className="text-neutral-500 text-center mb-6">Start the first community research by clicking the button above</p>
								<a href="/create" className="btn btn-primary">Create</a>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export const ResearchDetails: FC = (props) => {
	return (
		<div className="card bg-white shadow-md rounded-xl overflow-hidden">
			<div className="p-6">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-lg font-medium text-neutral-500">
						Reading Research
					</h3>
					<div className="flex items-center gap-2">
						<a href="/" className="btn btn-secondary btn-sm flex items-center space-x-1">
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
								This research report is AI-generated and may contain errors. Always verify important information from multiple sources.
							</p>
						</div>
					</div>
				</div>

				<h2 className="text-2xl font-bold text-neutral-900 mb-6">{props.research.query}</h2>

				<div className="space-y-6">
					<div className="border border-neutral-200 rounded-lg overflow-hidden">
						<div className="flex items-center px-4 py-3 bg-neutral-50 border-b border-neutral-200">
							<button className="flex items-center justify-between w-full text-left">
								<span className="font-medium text-neutral-800">Research Parameters</span>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<polyline points="6 9 12 15 18 9"></polyline>
								</svg>
							</button>
						</div>

						<div className="p-4 bg-white">
							<table className="w-full text-sm">
								<tbody>
									<tr className="border-b border-neutral-100">
										<th className="py-2 pr-4 font-medium text-neutral-700 text-left">Depth</th>
										<td className="py-2 text-neutral-900">{props.research.depth}</td>
									</tr>
									<tr>
										<th className="py-2 pr-4 font-medium text-neutral-700 text-left">Breadth</th>
										<td className="py-2 text-neutral-900">{props.research.breadth}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<div className="border border-neutral-200 rounded-lg overflow-hidden">
						<div className="flex items-center px-4 py-3 bg-neutral-50 border-b border-neutral-200">
							<button className="flex items-center justify-between w-full text-left">
								<span className="font-medium text-neutral-800">Drill-Down Questions</span>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<polyline points="6 9 12 15 18 9"></polyline>
								</svg>
							</button>
						</div>

						<div className="divide-y divide-neutral-100">
							{props.research.questions.map((obj) => (
								<div className="p-4 bg-white">
									<div className="font-medium text-neutral-800 mb-1">{obj.question}</div>
									<div className="text-sm text-neutral-600">{obj.answer}</div>
								</div>
							))}
						</div>
					</div>

					<div className="border border-neutral-200 rounded-lg overflow-hidden">
						<div className="flex items-center px-4 py-3 bg-neutral-50 border-b border-neutral-200">
							<div className="flex items-center justify-between w-full">
								<span className="font-medium text-neutral-800">Research Report</span>
								{props.research.status === 1 && (
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
							<div className="report prose max-w-none">{html(props.research.report_html)}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const CreateResearch: FC = () => {
	return (
		<>
			<div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg shadow-sm">
				<div className="flex">
					<div className="flex-shrink-0">
						<svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
						</svg>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-blue-800">Public Research Notice</h3>
						<div className="mt-2 text-sm text-blue-700">
							<p>All research conducted on e-saliksik is publicly available. Please do not include sensitive or personal information in your queries.</p>
						</div>
					</div>
				</div>
			</div>

			<div className="card bg-white shadow-md rounded-xl overflow-hidden">
				<div className="p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-neutral-900">
							Generate Research Report
						</h2>
						<a href="/" className="btn btn-secondary btn-sm flex items-center space-x-1">
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

					<form
						className="space-y-6 max-w-2xl"
						action="/create"
						method="post"
					>
						<div className="space-y-2">
							<label className="block text-sm font-medium text-neutral-700">
								What do you want to research?
							</label>
							<div className="relative">
								<textarea
									id="research-query"
									name="query"
									className="w-full min-h-32 p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
									required={true}
									placeholder="Write me a report about..."
								></textarea>
								<div className="group absolute bottom-3 right-3">
									<button
										type="button"
										id="optimize-topic-btn"
										className="bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors border border-primary-200 rounded p-2"
										aria-label="Optimize my research topic with AI"
									>
										<span id="optimize-icon" className="block">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
											</svg>
										</span>
										<span id="optimize-loading" className="hidden">
											<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
										</span>
										<div className="absolute bottom-full right-0 mb-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
											<div className="bg-neutral-800 text-white text-xs rounded py-1 px-2 shadow-lg">
												Optimize my research topic with AI
											</div>
										</div>
									</button>
								</div>
							</div>
							<div className="flex justify-between">
								<div className="text-xs text-neutral-500 flex items-center">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
										<path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
									</svg>
									<span>Tip: Click the lightning bolt to refine your research topic with AI</span>
								</div>
								<div id="optimization-status" className="text-sm text-neutral-600 hidden mt-2"></div>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="block text-sm font-medium text-neutral-700">
									Research Depth
								</label>
								<div className="flex items-center">
									<input
										name="depth"
										type="number"
										min="1"
										max="5"
										className="w-20 p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
										value="3"
										required={true}
									/>
									<div className="ml-3 text-sm text-neutral-500">
										<span className="block">1 = Basic research</span>
										<span className="block">5 = Deep, extensive research</span>
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<label className="block text-sm font-medium text-neutral-700">
									Research Breadth
								</label>
								<div className="flex items-center">
									<input
										name="breadth"
										type="number"
										min="1"
										max="5"
										className="w-20 p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
										value="3"
										required={true}
									/>
									<div className="ml-3 text-sm text-neutral-500">
										<span className="block">1 = Focused, narrow scope</span>
										<span className="block">5 = Wide, exploratory scope</span>
									</div>
								</div>
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

			<script dangerouslySetInnerHTML={{
				__html: `
					document.addEventListener('DOMContentLoaded', () => {
						const optimizeBtn = document.getElementById('optimize-topic-btn');
						const textarea = document.getElementById('research-query');
						const optimizeIcon = document.getElementById('optimize-icon');
						const loadingIndicator = document.getElementById('optimize-loading');
						const statusElement = document.getElementById('optimization-status');
						
						if (optimizeBtn && textarea) {
							optimizeBtn.addEventListener('click', async () => {
								const currentText = textarea.value.trim();
								
								if (!currentText) {
									statusElement.textContent = 'Please enter a research topic first';
									statusElement.className = 'text-sm text-amber-600 mt-2';
									statusElement.classList.remove('hidden');
									
									setTimeout(() => {
										statusElement.classList.add('hidden');
									}, 3000);
									return;
								}
								
								// Show loading indicator
								optimizeIcon.classList.add('hidden');
								loadingIndicator.classList.remove('hidden');
								optimizeBtn.disabled = true;
								
								statusElement.textContent = 'Optimizing your research topic...';
								statusElement.className = 'text-sm text-primary-600 mt-2';
								statusElement.classList.remove('hidden');
								
								try {
									const response = await fetch('/api/optimize-topic', {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({
											topic: currentText
										})
									});
									
									if (!response.ok) {
										throw new Error('Failed to optimize topic');
									}
									
									const data = await response.json();
									
									if (data.optimizedTopic) {
										textarea.value = data.optimizedTopic;
										
										statusElement.innerHTML = '<span class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>Research topic optimized successfully</span>';
										statusElement.className = 'text-sm text-green-600 mt-2';
										
										// Highlight the textarea briefly
										textarea.classList.add('ring-2', 'ring-green-500');
										setTimeout(() => {
											textarea.classList.remove('ring-2', 'ring-green-500');
										}, 2000);
										
										setTimeout(() => {
											statusElement.classList.add('hidden');
										}, 5000);
									}
								} catch (error) {
									console.error('Error optimizing topic:', error);
									
									statusElement.textContent = 'Failed to optimize topic. Please try again.';
									statusElement.className = 'text-sm text-red-600 mt-2';
									
									setTimeout(() => {
										statusElement.classList.add('hidden');
									}, 4000);
								} finally {
									// Hide loading indicator
									optimizeIcon.classList.remove('hidden');
									loadingIndicator.classList.add('hidden');
									optimizeBtn.disabled = false;
								}
							});
						}
					});
				`
			}}></script>
		</>
	);
};

export const NewResearchQuestions: FC = (props) => {
	return (
		<>
			<div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg shadow-sm">
				<div className="flex">
					<div className="flex-shrink-0">
						<svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
						</svg>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-blue-800">Public Research Notice</h3>
						<div className="mt-2 text-sm text-blue-700">
							<p>All research conducted on e-saliksik is publicly available. Please do not include sensitive or personal information in your answers.</p>
						</div>
					</div>
				</div>
			</div>

			<div className="card bg-white shadow-md rounded-xl overflow-hidden">
				<div className="p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-neutral-900">
							Research Drill-Down Questions
						</h2>
						<a href="/" className="btn btn-secondary btn-sm flex items-center space-x-1">
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
						<div className="text-sm font-medium text-primary-800 mb-1">Initial Research Query:</div>
						<p className="text-primary-900">{props.research.query}</p>
					</div>

					<div className="max-w-2xl">
						<div className="mb-6">
							<h3 className="text-lg font-medium text-neutral-800 mb-2">
								To get better results, please answer these follow-up questions:
							</h3>
							<p className="text-neutral-600 text-sm mb-4">
								These questions will help the AI understand your needs better and provide more relevant research.
							</p>
							<button
								type="button"
								id="prefill-all-btn"
								className="text-sm font-medium bg-primary-100 text-primary-800 hover:bg-primary-200 px-3 py-2 rounded-md flex items-center transition-colors"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
									<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
								</svg>
								Generate All Answers with AI
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

						<form action="/create/finish" method="post" className="space-y-6" id="research-questions-form">
							<input name="query" value={props.research.query} type="hidden" id="research-query" />
							<input name="breadth" value={props.research.breadth} type="hidden" />
							<input name="depth" value={props.research.depth} type="hidden" />

							{props.questions.map((obj, index) => (
								<div className="space-y-2">
									<label className="block text-sm font-medium text-neutral-700" id={`question-${index}-label`}>
										{index + 1}. {obj}
									</label>
									<input name="question" value={obj} type="hidden" />
									<div className="relative">
										<input
											id={`answer-${index}`}
											name="answer"
											className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
											required
											placeholder="Your answer..."
										/>
										<button
											type="button"
											className="suggest-btn bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors border border-primary-200 absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-sm flex items-center"
											data-index={index}
										>
											<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
												<path fill-rule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clip-rule="evenodd" />
												<path fill-rule="evenodd" d="M5 11a5 5 0 1110 0 5 5 0 01-10 0zm5-3a3 3 0 100 6 3 3 0 000-6z" clip-rule="evenodd" />
											</svg>
											<span>AI Suggest</span>
											<span className="loading-indicator hidden ml-1">
												<svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
													<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
													<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
												</svg>
											</span>
										</button>
									</div>
									<div className="suggestion-status text-xs text-neutral-500 hidden">
										<span className="flex items-center text-green-600">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
												<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
											</svg>
											AI-generated answer applied
										</span>
									</div>
								</div>
							))}

							<div className="pt-2">
								<button className="btn btn-primary w-full md:w-auto">
									Generate
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			<script dangerouslySetInnerHTML={{
				__html: `
					document.addEventListener('DOMContentLoaded', () => {
						const form = document.getElementById('research-questions-form');
						const researchQuery = document.getElementById('research-query').value;
						const suggestAllBtn = document.getElementById('prefill-all-btn');
						const allSuggestionsStatus = document.getElementById('all-suggestions-status');
						
						// Function to fetch AI suggestion for a single question
						async function getAISuggestion(question) {
							try {
								const response = await fetch('/api/suggest-answer', {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({
										question: question,
										query: researchQuery
									}),
								});
								
								if (!response.ok) {
									throw new Error('Failed to get suggestion');
								}
								
								const data = await response.json();
								return data.answer;
							} catch (error) {
								console.error('Error getting suggestion:', error);
								return null;
							}
						}
						
						// Handle individual suggestion buttons
						document.querySelectorAll('.suggest-btn').forEach(button => {
							button.addEventListener('click', async function() {
								// Get elements
								const index = this.getAttribute('data-index');
								const questionElement = document.getElementById(\`question-\${index}-label\`);
								const inputElement = document.getElementById(\`answer-\${index}\`);
								const loadingIndicator = this.querySelector('.loading-indicator');
								const statusElement = this.closest('.space-y-2').querySelector('.suggestion-status');
								
								if (!questionElement || !inputElement) return;
								
								// Get question text (remove the number prefix)
								const questionText = questionElement.textContent.trim();
								const questionWithoutNumber = questionText.substring(questionText.indexOf('. ') + 2);
								
								// Show loading state
								this.disabled = true;
								loadingIndicator.classList.remove('hidden');
								
								// Get AI suggestion
								const suggestion = await getAISuggestion(questionWithoutNumber);
								
								// Update UI
								if (suggestion) {
									inputElement.value = suggestion;
									statusElement.classList.remove('hidden');
								}
								
								// Reset button state
								this.disabled = false;
								loadingIndicator.classList.add('hidden');
							});
						});
						
						// Handle suggest all button
						if (suggestAllBtn) {
							suggestAllBtn.addEventListener('click', async function() {
								// Show loading state
								this.disabled = true;
								allSuggestionsStatus.classList.remove('hidden');
								
								// Get all question elements
								const questionElements = document.querySelectorAll('[id^="question-"][id$="-label"]');
								
								// Process each question sequentially
								for (let i = 0; i < questionElements.length; i++) {
									const questionElement = questionElements[i];
									const index = questionElement.id.replace('question-', '').replace('-label', '');
									const inputElement = document.getElementById(\`answer-\${index}\`);
									const statusElement = inputElement.closest('.space-y-2').querySelector('.suggestion-status');
									
									// Get question text (remove the number prefix)
									const questionText = questionElement.textContent.trim();
									const questionWithoutNumber = questionText.substring(questionText.indexOf('. ') + 2);
									
									// Get AI suggestion
									const suggestion = await getAISuggestion(questionWithoutNumber);
									
									// Update UI
									if (suggestion) {
										inputElement.value = suggestion;
										statusElement.classList.remove('hidden');
									}
								}
								
								// Reset button state
								this.disabled = false;
								allSuggestionsStatus.innerHTML = '<span class="flex items-center text-green-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>All answers generated</span>';
							});
						}
					});
				`
			}}></script>
		</>
	);
};