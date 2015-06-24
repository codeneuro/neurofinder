def run(data):
    """
    Run a source extraction algorithm on an Images object

    Parameters
    ----------
    data : thunder.rdds.images.Images
        The data the algorithm will be run on

    Returns
    -------
    result : thunder.extraction.source.SourceModel
        Sources found by the algorithm as a SourceModel object
    """
    from thunder import SourceExtraction
    method = SourceExtraction('localmax')
    result = method.fit(data)
    return result
